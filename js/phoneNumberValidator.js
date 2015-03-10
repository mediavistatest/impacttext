var PhoneNumberArrayValidator = {
    PhoneNumbers : {
        inputNumberString : '',
        outputNumberString : '',
        error : ''
    },
    checkPhoneNumber : function(phoneNumber) {
        var commaPosition_ = PhoneNumberArrayValidator.PhoneNumbers.inputNumberString.indexOf(',')
        if (phoneNumber) {
            if (phoneNumber.length == 10 && phoneNumber == phoneNumber.replace(/\D/g, '')) {
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

            } else {
                console.log('Error: ' + phoneNumber + ' is not valid phone number!');
                PhoneNumberArrayValidator.PhoneNumbers.outputNumberString = '';
                PhoneNumberArrayValidator.PhoneNumbers.inputNumberString = '';
                PhoneNumberArrayValidator.PhoneNumbers.error = phoneNumber;
            }
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
            PhoneNumberArrayValidator.checkPhoneNumber(currentPhoneNumber_);
        }
        currentPhoneNumber_ = PhoneNumberArrayValidator.PhoneNumbers.inputNumberString;
        PhoneNumberArrayValidator.checkPhoneNumber(currentPhoneNumber_);

        return PhoneNumberArrayValidator.PhoneNumbers;
    }
}

// var testString = '01-23456789, 111.111.1111, 222-2222.222, 00115-678.910, 9999996666, 0987654321, 123456uio9, 11122233345'
// var testString = '01-23456789, 111.111.1111, 222-2222.222, 00115-678.91, 9999996666, 0987654321, 123456uio9, 11122233345'
var testString = '01-23456789, 111.111.1111, 222-2222.222, 00115-678.91, 9999996666, 0987654321,      1122233345'
// var testString = '01-23456789, 111.111.1111, 222-2222.222, 00115-678.91,           99999  8 96666          , 0987654321,      1122233345'
console.log(testString)
PhoneNumberArrayValidator.ParseAndValidateNumbers(testString)

//*************************************************************************************


