/**
 * Created by munveergill on 19/03/2017.
 */
describe('Foodie run', function() {
    it('Complete entire program', function() {
        browser.get('http://localhost:8000/#!/');

        element(by.linkText('Login')).click();

        var inputEl = element(by.model('email'));
        var password = element(by.model('password'));
        inputEl.sendKeys('munveer.gill@gmail.com');
        password.sendKeys('me');
        element(by.buttonText('Log In')).click();
        element(by.css('[ui-sref="recommendations"]')).click();
        var count = element.all(by.repeater('x in recommendations'));
        count.then(function(result){
            expect(result.length).toBeGreaterThan(1);
        });

        var count2 = element.all(by.repeater('x in lunch'));
        count2.then(function(result){
            expect(result.length).toBeGreaterThan(1);
        });
        element(by.css('[ui-sref="user-dashboard"]')).click();
        element(by.css('[ui-sref="create-meal-plan"]')).click();
        element(by.tagName('md-radio-button')).click();
        element(by.model('form.checkbox.lunch')).click();
        var date = element(by.className('md-datepicker-input'));
        date.sendKeys('3/22/2017');
        element(by.buttonText('Next')).click();
        element(by.buttonText('Add')).click();
        element(by.buttonText('Choose recipe from likes')).click();
        element(by.css('[ng-click="replace($index)"]')).click();
        var elm1 = element(by.buttonText('Add'));
        browser.executeScript("arguments[0].scrollIntoView();", elm1.getWebElement());
        elm1.click();
        element(by.buttonText('Eating out?')).click();

        var elm = element(by.css('[ng-click="save($event)"]'));
        browser.executeScript("arguments[0].scrollIntoView();", elm.getWebElement());
        elm.click();
        element(by.buttonText('Yes')).click();
        //browser.pause();

    });
});