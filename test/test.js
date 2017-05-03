var chai_assert = chai.assert;

describe('KhoaiJS App', function () {
    describe('Static property of KhoaiJS', function () {
        it('App must be a static property of KhoaiJS if exists', function (cb) {
            if (window.hasOwnProperty('Khoai')) {
                chai_assert.property(Khoai, 'App');
                cb();
            } else {
                cb();
            }
        });
        it('Static property of KhoaiJS and standalone object of App must be same', function (cb) {
            if (window.hasOwnProperty('Khoai')) {
                chai_assert.strictEqual(Khoai.Element, Element);
                cb();
            } else {
                cb();
            }
        })
    });
});