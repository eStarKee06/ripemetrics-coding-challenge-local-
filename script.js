/*Manager: in charge of functionalities of program;
  in charge of storing data needed for program as a whole*/
class Manager extends React.Component {
  constructor(props) {
    super(props);
    this.state = { //Manager states
      savedStudents: [],
      highestGPA: [], // list of index to state
      lowestGPA: [] //list of index to state
    };
    this.currentStudentData = { //template to create student datas
      name: "",
      math: "",
      history: "",
      science: "",
      english: "",
      gpa: "" };

    //Manager functions; binding
    this.submitStudentInput = this.submitStudentInput.bind(this);
    this.displayRender = this.displayRender.bind(this);
    this.resetCurrentStudentData = this.resetCurrentStudentData.bind(this);
    this.calculatePts = this.calculatePts.bind(this);
    this.initStudentGrade = this.initStudentGrade.bind(this);
    this.convertInput = this.convertInput.bind(this);
    this.convertCapital = this.convertCapital.bind(this);
    this.addExtremes = this.addExtremes.bind(this);
    this.studentDataSelected = this.studentDataSelected.bind(this);
    this.removeStudent = this.removeStudent.bind(this);
    this.filterToKeep = this.filterToKeep.bind(this);
	this.reEval = this.reEval.bind(this);

	$.ajax({
		url: 'https://api.myjson.com/bins/z8ctu',
		crossDomain: true,
		dataType: 'json',
		success:(data) => {
			for(var i = 0; i < data["data"].length; i++){
				this.currentStudentData.name = data["data"][i]["name"],
				this.currentStudentData.math = ((data["data"][i]["grades"])[0]).charAt(((data["data"][i]["grades"])[0]).length - 1),
				this.currentStudentData.history = ((data["data"][i]["grades"])[1]).charAt(((data["data"][i]["grades"])[1]).length - 1),
				this.currentStudentData.science = ((data["data"][i]["grades"])[2]).charAt(((data["data"][i]["grades"])[2]).length - 1),
				this.currentStudentData.english = ((data["data"][i]["grades"])[3]).charAt(((data["data"][i]["grades"])[3]).length - 1)
			
				this.submitStudentInput();
			}
		}
	});

  }

  //--------------------------------FUNCTIONS:---------------------------------------
  //--------------------adding student data:-----------------------------------
  submitStudentInput() {
    this.currentStudentData.math = this.initStudentGrade(this.currentStudentData.math);
    this.currentStudentData.history = this.initStudentGrade(this.currentStudentData.history);
    this.currentStudentData.science = this.initStudentGrade(this.currentStudentData.science);
    this.currentStudentData.english = this.initStudentGrade(this.currentStudentData.english);
    this.currentStudentData.selected = false;

    var currentGPA = this.calculatePts([this.currentStudentData.math,
    this.currentStudentData.history,
    this.currentStudentData.science, this.currentStudentData.english]);
    if (currentGPA == -1) {// invalid input
      this.resetCurrentStudentData();
      return;
    }
    this.currentStudentData.gpa = parseFloat(currentGPA).toFixed(2);

    //------if input is valid-------------------------------------
    const localSavedStudents = this.state.savedStudents.slice();
    localSavedStudents.push(Object.assign({}, this.currentStudentData));
    this.setState({ savedStudents: localSavedStudents }, () => {this.addExtremes();}); // callback to prevent delay in changing state
    this.resetCurrentStudentData();
  }

  calculatePts(subjectGrades) {// calculate student GPA based off of input
    var total = 0;
    for (var i = 0; i < subjectGrades.length; i++) {
      switch (subjectGrades[i]) {
        case "A":
          total += 4;
          break;
        case "B":
          total += 3;
          break;
        case "C":
          total += 2;
          break;
        case "D":
          total += 1;
          break;
        case "F":
          total += 0;
          break;
        default:
          alert("invalid grade input/s");
          return -1; //error 
      }
    }
    return total / subjectGrades.length;
  }

  convertInput(input) {//converts input into a letter grade for testing
    if (Number(input) >= 90) {
      return "A";
    }
    if (Number(input) >= 80 && Number(input) < 90) {
      return "B";
    }
    if (Number(input) >= 70 && Number(input) < 80) {
      return "C";
    }
    if (Number(input) >= 60 && Number(input) < 50) {
      return "D";
    }
    return "F";
  }

  convertCapital(input) {// turn lower case grade inputs as upper case
    return input.toUpperCase();
  }

  initStudentGrade(input) {// decides how to convert grade for easier calculation
    if (Number(input) != NaN && Number(input) > 0) {
      return this.convertInput(input);
    } 
	else {
      return this.convertCapital(input);
    }
  }

  //---------reset studentData; prep for next insertion----
  resetCurrentStudentData() {
    this.currentStudentData = {
      name: "",
      math: "",
      history: "",
      science: "",
      english: "",
      gpa: "" };

    this.refs.nameInput.value = "";
    this.refs.mathInput.value = "";
    this.refs.historyInput.value = "";
    this.refs.scienceInput.value = "";
    this.refs.englishInput.value = "";
  }

  //---------------------handling min and max coloring------------------------------
  addExtremes() {// determines if new data is a max or a min
    if (this.state.savedStudents.length > 1) {
      if (Number(this.state.savedStudents[this.state.savedStudents.length - 1].gpa) ==
      Number(this.state.savedStudents[this.state.highestGPA[0]].gpa)) {
        const highestArr = this.state.highestGPA.slice();
        highestArr.push(this.state.savedStudents.length - 1);
        this.setState({ highestGPA: highestArr });
      } 
	  else if (Number(this.state.savedStudents[this.state.savedStudents.length - 1].gpa) ==
      Number(this.state.savedStudents[this.state.lowestGPA[0]].gpa)) {
        const lowestArr = this.state.lowestGPA.slice();
        lowestArr.push(this.state.savedStudents.length - 1);
        this.setState({ lowestGPA: lowestArr });
      }
	  else if (Number(this.state.savedStudents[this.state.savedStudents.length - 1].gpa) >
      Number(this.state.savedStudents[this.state.highestGPA[0]].gpa)) {
        const highestArr = [this.state.savedStudents.length - 1];
        this.setState({ highestGPA: highestArr });
      } 
	  else if (Number(this.state.savedStudents[this.state.savedStudents.length - 1].gpa) <
      Number(this.state.savedStudents[this.state.lowestGPA[0]].gpa)) {
        const lowestArr = [this.state.savedStudents.length - 1];
        this.setState({ lowestGPA: lowestArr });
      }
    } 
	else{
      const elementArr = [this.state.savedStudents.length - 1];
      this.setState({ lowestGPA: elementArr });
      this.setState({ highestGPA: elementArr });
    }
  }

  //-------------------displaying the saved data-------------------------------
  displayRender(i) {
    var cusStyle = {
		backgroundColor: 'rgba(10, 60, 190, 0.2)' 
	  };
    if (this.state.highestGPA.includes(i)) {
      cusStyle = {
        backgroundColor: 'rgba(80,255,80, 1)' 
	  };
    }
	else if (this.state.lowestGPA.includes(i)) {
      cusStyle = {
        backgroundColor: 'rgba(255,60,60, 1)' 
	  };
    }
    if (this.state.savedStudents[i].selected) {
      cusStyle = {
        border: '2px solid blue' 
	  };
    }

    return React.createElement(StudentDataDisplay, {
      style: cusStyle,
      onClick: () => {this.studentDataSelected(i);},
      name: this.state.savedStudents[i].name,
      mathGrade: this.state.savedStudents[i].math,
      historyGrade: this.state.savedStudents[i].history,
      scienceGrade: this.state.savedStudents[i].science,
      englishGrade: this.state.savedStudents[i].english,
      gpa: this.state.savedStudents[i].gpa });

  }

  //---removing student data-----------------------------------
  studentDataSelected(index) {
    const savedArr = this.state.savedStudents.slice();
    savedArr[index].selected = !savedArr[index].selected;
    this.setState({ savedStudents: savedArr });
  }

  removeStudent() {
    const studentsToKeep = this.state.savedStudents.slice();
    const editedStudentArr = studentsToKeep.filter(this.filterToKeep);
    this.setState({ savedStudents: editedStudentArr }, ()=>{this.reEval();});
  }

  reEval(){
    var lowestIndex = [];
    var lowestVal = 4;
    var highestIndex = [];
    var highestVal = 0;
    for(var i = 0; i < this.state.savedStudents.length; i++){
      if(highestVal < Number(this.state.savedStudents[i].gpa)){
        highestVal = Number(this.state.savedStudents[i].gpa);
        highestIndex = [i];
      }
      else if (highestVal == Number(this.state.savedStudents[i].gpa)){
        highestIndex.push(i);
      }
      if(lowestVal > Number(this.state.savedStudents[i].gpa)){
        lowestVal = Number(this.state.savedStudents[i].gpa);
        lowestIndex= [i];
      }
      else if (lowestVal == Number(this.state.savedStudents[i].gpa)){
        lowestIndex.push(i);
      }
    }
    this.setState({lowestGPA: lowestIndex});
    this.setState({highestGPA: highestIndex});
  }

  filterToKeep(currStudent) {
    return !(currStudent.selected);
  }
  //end Functions------------------------------------------------------------

  render() {//create student data based on what's in savedStudents  
    const defaultStudentData = [];
    for (var i = 0; i < this.state.savedStudents.length; i++) {
      defaultStudentData.push(this.displayRender(i));
    }
    return (//HTML contents:
      React.createElement("div", { className: "outermost-window" },
      React.createElement("div", { className: "title" }, "STUDENT GRADE STORAGE"),
      React.createElement("div", { className: "manager-body" },
      React.createElement("div", { className: "body-headers" },
      React.createElement("label", null, "Name"),
      React.createElement("label", null, "Math"),
      React.createElement("label", null, "History"),
      React.createElement("label", null, "Science"),
      React.createElement("label", null, "English"),
      React.createElement("label", null, "GPA")),

      defaultStudentData),

      React.createElement("div", { className: "manager-input" },
      React.createElement("input", { type: "text", ref: "nameInput", placeholder: "enter student name", onChange: e => {
          this.currentStudentData.name = e.target.value;
        } }),

      React.createElement("input", { type: "text", ref: "mathInput", placeholder: "enter math letter grade", onChange: e => {
          this.currentStudentData.math = e.target.value;
        } }),

      React.createElement("input", { type: "text", ref: "historyInput", placeholder: "enter history letter grade", onChange: e => {
          this.currentStudentData.history = e.target.value;
        } }),

      React.createElement("input", { type: "text", ref: "scienceInput", placeholder: "enter science letter grade", onChange: e => {
          this.currentStudentData.science = e.target.value;
        } }),

      React.createElement("input", { type: "text", ref: "englishInput", placeholder: "enter english letter grade", onChange: e => {
          this.currentStudentData.english = e.target.value;
        } }),
      React.createElement("button", { className: "input-button", onClick: this.submitStudentInput }, " Add Student"),
      React.createElement("button", { className: "input-button", onClick: this.removeStudent }, "Remove Student"))));



  }}

//template to render stored student data
class StudentDataDisplay extends React.Component {
  render() {
    return (
      React.createElement("div", { className: "student-data", style: this.props.style, onClick: this.props.onClick },
      React.createElement("label", null, this.props.name),
      React.createElement("label", null, this.props.mathGrade),
      React.createElement("label", null, this.props.historyGrade),
      React.createElement("label", null, this.props.scienceGrade),
      React.createElement("label", null, this.props.englishGrade),
      React.createElement("label", null, this.props.gpa)));
  }}

//=========================================================
//connect react script to index
ReactDOM.render(
React.createElement(Manager, null),
document.getElementById('window'));
