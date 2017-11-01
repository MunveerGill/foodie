/**
 * Created by munveergill on 19/03/2017.
 */
describe('Foodie recipe details', function() {
    it('should contain a search box', function() {
        browser.get('http://localhost:8000/#!/');

        var inputEl = element(by.tagName('input'));
        inputEl.sendKeys('chicken');
        var button = element(by.id('btn'));
        button.click();
        element(by.repeater('x in x').row(0)).element(by.css('.ng-scope')).click();

        var instructions = element(by.className('col-lg-5'));
        expect(element(by.tagName('h4')).getText()).toBe('Carbohydrates');


    });
});