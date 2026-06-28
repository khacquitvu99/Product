function getId(id) { return document.getElementById(id); }

class Validation {
  
    testEmpty(_id, _value, _message) {
        if (_value.trim() === "") {
            getId(_id).innerHTML = _message;
            getId(_id).style.display = "block";
            return false;
        }
        else {
            getId(_id).innerHTML = "";
            getId(_id).style.display = "none";
            return true;
        }
    }
    testFormat(_id, _value, _message, _regex) {

        if (!_regex.test(_value)) {
            getId(_id).innerHTML = _message;
            getId(_id).style.display = "block";
            return false;
        }
        else {
            getId(_id).innerHTML = "";
            getId(_id).style.display = "none";
            return true;
        }
    }
    testLength(_id, _value, _message, _min, _max) {
        if (_value.trim().length < _min || _value.trim().length > _max) {
            getId(_id).innerHTML = _message;
            getId(_id).style.display = "block";
            return false;
        }
        else {
            getId(_id).innerHTML = "";
            getId(_id).style.display = "none";
            return true;
        }
    }
    testValue(_id, _value, _message, _compareValue) {
        if (_value === _compareValue) {
            getId(_id).innerHTML = _message;
            getId(_id).style.display = "block";
            return false;
        }
        else {
            getId(_id).innerHTML = "";
            getId(_id).style.display = "none";
            return true;
        }
    }
}
export default Validation;