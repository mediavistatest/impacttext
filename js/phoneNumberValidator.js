var PhoneNumberArrayValidator = {
    PhoneNumbers : {
        inputNumberString : '',
        outputNumberString : '',
        errorNumber : '',
        errorMessage : ''
    },
    setError : function(phoneNumber, message) {
        PhoneNumberArrayValidator.PhoneNumbers.outputNumberString = '';
        PhoneNumberArrayValidator.PhoneNumbers.inputNumberString = '';
        PhoneNumberArrayValidator.PhoneNumbers.errorNumber = phoneNumber;
        PhoneNumberArrayValidator.PhoneNumbers.errorMessage = message;
    },
    addPhoneToOutput : function(phoneNumber) {
        var commaPosition_ = PhoneNumberArrayValidator.PhoneNumbers.inputNumberString.indexOf(',')
        if (PhoneNumberArrayValidator.validatePhoneNumber(phoneNumber)) {
            if (PhoneNumberArrayValidator.PhoneNumbers.outputNumberString.length > 0) {
                PhoneNumberArrayValidator.PhoneNumbers.outputNumberString = PhoneNumberArrayValidator.PhoneNumbers.outputNumberString + ', ' + '1' + phoneNumber;
            } else {
                PhoneNumberArrayValidator.PhoneNumbers.outputNumberString = '1' + phoneNumber;
            }
            if (commaPosition_ > -1) {
                PhoneNumberArrayValidator.PhoneNumbers.inputNumberString = (PhoneNumberArrayValidator.PhoneNumbers.inputNumberString.substring(commaPosition_ + 1, 100000));
            } else {
                PhoneNumberArrayValidator.PhoneNumbers.inputNumberString = '';
            }
        }
    },
    validatePhoneNumber : function(phoneNumber) {
        if (phoneNumber) {
            if (!(phoneNumber == phoneNumber.replace(/\D/g, ''))) {
                var msg = 'Error: ' + phoneNumber + ' is not digits only!';
                PhoneNumberArrayValidator.setError(phoneNumber, msg);
                return false;
            }
            if (phoneNumber.length < 10) {
                var msg = 'Error: ' + phoneNumber + ' is less then 10 digits number (lenght=' + phoneNumber.length + ')!';
                PhoneNumberArrayValidator.setError(phoneNumber, msg);
                return false;
            }

            if (phoneNumber.length > 10) {
                var msg = 'Error: ' + phoneNumber + ' is greater then 10 digits number (lenght=' + phoneNumber.length + ')!';
                PhoneNumberArrayValidator.setError(phoneNumber, msg);
                return false;
            }

            if (!(2 <= phoneNumber.substring(1, 2) <= 9)) {
                var msg = 'Error: ' + phoneNumber + ' second digit is not in range (2-9)!';
                PhoneNumberArrayValidator.setError(phoneNumber, msg);
                return false;
            }
            if (!(2 <= phoneNumber.substring(3, 4) <= 9)) {
                var msg = 'Error: ' + phoneNumber + ' fourth digit is not in range (2-9)!';
                PhoneNumberArrayValidator.setError(phoneNumber, msg);
                return false;
            }
            //PASSED all validations , VALID PHONE NUMBER
            return true;
        }
    },
    ParseAndValidateNumbers : function(numbersString) {
        PhoneNumberArrayValidator.PhoneNumbers.inputNumberString = numbersString;

        //Remove special chars
        PhoneNumberArrayValidator.PhoneNumbers.inputNumberString = PhoneNumberArrayValidator.PhoneNumbers.inputNumberString.replace(/[&\/\\#+()$~%.'":*?<>{}-]/g, '');
        //Remove blanks
        PhoneNumberArrayValidator.PhoneNumbers.inputNumberString = PhoneNumberArrayValidator.PhoneNumbers.inputNumberString.replace(/\s+/g, '');

        var currentPhoneNumber_ = '';
        while (PhoneNumberArrayValidator.PhoneNumbers.inputNumberString.indexOf(',') != -1) {
            var currentPhoneNumber_ = PhoneNumberArrayValidator.PhoneNumbers.inputNumberString.substring(0, PhoneNumberArrayValidator.PhoneNumbers.inputNumberString.indexOf(','));
            PhoneNumberArrayValidator.addPhoneToOutput(currentPhoneNumber_);
        }
        currentPhoneNumber_ = PhoneNumberArrayValidator.PhoneNumbers.inputNumberString;
        PhoneNumberArrayValidator.addPhoneToOutput(currentPhoneNumber_);

        return PhoneNumberArrayValidator.PhoneNumbers;
    }
};

// var testString = '01-23456789, 111.111.1111, 222-2222.222, 00115-678.910, 9999996666, 0987654321, 123456uio9, 11122233345'
// var testString = '01-23456789, 111.111.1111, 222-2222.222, 00115-678.91, 9999996666, 0987654321, 123456uio9, 11122233345'
//var testString = '1234567890, 01-23456789, 111.111.1111, 222-2222.222, 00115-678.91, 9999996666, 0987654321,      1122233345'
//var testString = '01-23456789, 111.111.1111, 222-2222.222, 00115-678.91,           99999  8 96666          , 0987654321,      1122233345'

var testString = '01-234563789';

console.log(testString);
PhoneNumberArrayValidator.ParseAndValidateNumbers(testString);

//*************************************************************************************
//druga cifrea 2-9, peta cifra 2-9

