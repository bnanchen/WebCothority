
/*****************************************/
/**
 * MAIN
 */
$(document).ready(function () {
    // appelle la fonction udpate() toutes les 3 secondes:
    setInterval(function () {
        update()
    }, 3000);
    // $("#hello").on("click", function(event) {
    //   alert(list[0].name);
    // });
    var hello = $("#hello");
    hello.on("click", function () {
        console.log("Hello World!");
    });


    // PROMISE TEST:


   /* function *foo() {
        yield "foo";
        var x = 1;
        console.log(x);
    }

    var foo = foo();
    console.log(foo.next().value); // "foo"
    console.log(foo.return());


    var firstMethod = function() {
        var promise = new Promise(function(resolve, reject){
            setTimeout(function() {
                console.log('first method completed');
                resolve({data: '123'});
            }, 2000);
        });
        return promise;
    };


    var secondMethod = function(someStuff) {
        var promise = new Promise(function(resolve, reject){
            setTimeout(function() {
                console.log('second method completed');
                resolve({newData: someStuff.data + ' some more data'});
            }, 2000);
        });
        return promise;
    };

    var thirdMethod = function(someStuff) {
        var promise = new Promise(function(resolve, reject){
            setTimeout(function() {
                console.log('third method completed');
                resolve({result: someStuff.newData});
            }, 3000);
        });
        return promise;
    };

    firstMethod()
        .then(secondMethod)
        .then(thirdMethod);*/
});
