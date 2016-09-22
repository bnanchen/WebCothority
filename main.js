    // la notion de data je ne comprends pas...
    // si je mets dans le ready ne fonctionne pas:
    var hello = $("#hello");
    hello.on("click", function(event) {
      console.log("button hello clicked");
    });

    //suppression d'une ligne du tableau:
    $("#status").on("click", "tr", function(event) {
      console.log($(this).text());
    });

    //ajout d'une ligne au tableau:
    var submitted = $("#sss");
    submitted.submit(function(event) {
      if ($(".requested").val().length === 0) {
        console.log("un champ obligatoire n'a pas été rempli");
        event.preventDefault();
      }
    });

    $("#toDelete").on("click", function(event) {
      //$("#status tr.removable").remove(); // comment choisir la ligne où j'ai cliqué.
      $(this).closest("tr").remove();
    });


// MAIN:
    $( document ).ready(function() { // comme un main
      // appelle la fonction udpateList() toutes les 3 secondes:
      setInterval(function(){update()}, 3000);
      // $("#hello").on("click", function(event) {
      //   alert(list[0].name);
      // });



  });
