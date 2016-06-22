describe("ifvisible", function(){

    beforeEach(function() {
        ifvisible.setIdleDuration(0.5);
    });

    describe("Now method", function() {
        it("should initially be true", function() {
            expect(ifvisible.now()).toBe(true);
        });

        it("should have status hidden false", function() {
            expect(ifvisible.now('hidden')).toBe(false);
        });

        it("should have status idle false", function() {
            expect(ifvisible.now('idle')).toBe(false);
        });

        it("should have status active true", function() {
            expect(ifvisible.now('active')).toBe(true);
        });
    });


    describe("Now method idle", function() {
        beforeEach(function(done) {
            setTimeout(function() {
                done();
            }, 600);
        });
        it("should initially be true", function() {
            expect(ifvisible.now()).toBe(false);
        });

        it("should have status idle false", function() {
            expect(ifvisible.now('idle')).toBe(true);
        });
    });
});
