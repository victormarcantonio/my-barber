

	$(document).ready(function() {

		
	
		$("#logout").on('click',function(){
			
			sessionStorage.clear();
		});
		
		if(getToken()){
			var dadosUsuario = getAtributoUsuarioJWT().dadosUsuario;
			
			$("#nome-usuario-sidbar").text(`${dadosUsuario.nomeFuncionario} ( ${dadosUsuario.usuario} )`);
			$("#cargo-sidbar").text(`${dadosUsuario.cargo}`);
		}
		
	
	});
	

	function lancarToastr(acao,mensagem,reload=false){
		
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
	  					if(reload)window.location.reload();
	  				}
				}
				toastr[acao](mensagem);
	}

	function formatData(inputDate) {
		var date = new Date(inputDate);
		if (!isNaN(date.getTime())) {
			// Months use 0 index.
			return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
		}
	}

	function getDateFromHours(time,dia,mes,ano) {
	mes = mes-1
	time = time.split(':');
	let now = new Date();
	if(dia && mes && ano){
		return new Date(ano,mes,dia, ...time);

	}else{
    	return new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...time);
    }
	}
	
	function parseJwt(token) {
	    var base64Url = token.split('.')[1];
	    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
	        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
	    }).join(''));

	    return JSON.parse(jsonPayload);
	};
	
	function getAtributoUsuarioJWT(){
		
		if(getToken()){
			let json = parseJwt(getToken());
			return json;
		}
	
	}
	

	function getIdBarbearia(token){
		
		let json = parseJwt(token);
		
		return json.dadosUsuario.idBarbearia;
	}
	
	function formataStringData(data) {
		  var dia  = data.split("/")[0];
		  var mes  = data.split("/")[1];
		  var ano  = data.split("/")[2];

		  return ano + '-' + ("0"+mes).slice(-2) + '-' + ("0"+dia).slice(-2);
		  // Utilizo o .slice(-2) para garantir o formato com 2 digitos.
		}

		function formataStringDataUSParaBR(data) {
			var ano  = data.split("-")[0];
			var mes  = data.split("-")[1];
			var dia  = data.split("-")[2];
  
			return  ("0"+dia).slice(-2) + '/' + ("0"+mes).slice(-2) + '/' + ano ;
			// Utilizo o .slice(-2) para garantir o formato com 2 digitos.
		  }


	function getToken(){
		
		return sessionStorage.getItem("accessToken");
	}
	
    function getRefreshToken(){
		
		return sessionStorage.getItem("refreshToken");
	}
	
	function fecharModalLoading(){
		
		setTimeout(function () {
			$('.modal-loading').modal('hide');
	   }, 1000);
	}
	
	
	function getNewToken(pageName){
		
		$.ajax(
				{
					type : 'POST',
					url: `http://localhost:8080/oauth/token`,
					data : "refresh_token="+getRefreshToken()+"&grant_type=refresh_token",
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
	}
	
	

