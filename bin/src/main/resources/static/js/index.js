

	$(document).ready(function() {
		
		

	});
	


function lancarToastr(acao,mensagem){
		
		toastr.options = {
					"closeButton": true,
					"debug": false,
					"newestOnTop": true,
					"progressBar": true,
					"positionClass": "toast-top-right",
					"preventDuplicates": true,
					"onclick": null,
					"showDuration": "300",
					"hideDuration": "300",
					"timeOut": "2000",
					"extendedTimeOut": "3000",
					"showEasing": "swing",
					"hideEasing": "linear",
					"showMethod": "fadeIn",
					"hideMethod": "fadeOut",
					"onHidden": function ()
	  				{
	  					if(acao=='success')window.location.reload();
	  				}
				}
				toastr[acao](mensagem);
}


function getDateFromHours(time,dia) {
	
    time = time.split(':');
    let now = new Date();
    if(dia){
    	return new Date(now.getFullYear(), now.getMonth(), dia, ...time);
    }else{
    	return new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...time);
    }
    
}




