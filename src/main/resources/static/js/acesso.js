$(document).ready(function (){
	
	
	
	
	  window.onunload = () => {
	    	
	    	if(localStorage.checkBoxValidation){
	    		
	    		
	    		$.post( "http://localhost:8080/oauth/token", { name: "John", time: "2pm" })
	    		  .done(function( data ) {
	    		    alert( "Data Loaded: " + data );
	    		  });
	    		
	    		$.ajax(
	    				{
	    					type : 'POST',
	    					url: `http://localhost:8080/oauth/token`,
	    					data : "refresh_token="+getRefreshToken()+"&grant_type=refresh_token",
	    				    async: false,
	    					'beforeSend': function (request) {
	    				        request.setRequestHeader("Authorization", `Basic ${btoa("servidorAuthMyBarber:123")}`);
	    						request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	    				    },
	    					error: function error(data)
	    					{
	    						lancarToastr("error","Erro ao atualizar token");
	    						sessionStorage.clear();
	    						window.location.href = "/";

	    					},
	    					//dataType: 'json',
	    					success: function success(data)
	    					{
	    						console.log(data)
	    						sessionStorage.setItem('accessToken', data.access_token);
	    						sessionStorage.setItem('refreshToken', data.refresh_token);
	    						window.location.reload(pageName)

	    					}
	    		  });
	    		
	    	}else{
	    		window.sessionStorage.clear();
	    	}
	    	
		}
	

});

