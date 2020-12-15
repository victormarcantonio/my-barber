$( document ).ready(function() {
  
  // SUBMIT FORM
    $("#redefinirSenha").submit(function(event) {
    // Prevent the form from submitting via the browser.
    event.preventDefault();
    ajaxPost();
  });
    
    
    function ajaxPost(){
      
      // PREPARE FORM DATA
      var formData = {
        firstname : $("senha").val(),
       
      }
      
      // DO POST
      $.ajax({
      type : "POST",
      contentType : "application/json",
      url : window.location + "usuarios/reset/",
      data : JSON.stringify(formData),
      dataType : 'json',
      success : function(result) {
        if(result.status == "Done"){
          $("#postResultDiv").html("<p style='background-color:#7FA7B0; color:white; padding:20px 20px 20px 20px'>" + 
                        "Post Successfully! <br>" +
                        "---> Customer's Info: FirstName = " + 
                        result.data.firstname + " ,LastName = " + result.data.lastname + "</p>");
        }else{
          $("#postResultDiv").html("<strong>Error</strong>");
        }
        console.log(result);
      },
      error : function(e) {
        alert("Error!")
        console.log("ERROR: ", e);
      }
    });
      
      // Reset FormData after Posting
      resetData();
 
    }
    
    function resetData(){
      $("#senha").val("");
     
    }
})