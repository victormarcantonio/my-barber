$(document).ready(function (){
	
	$('#form-barbearia')[0].reset();
	validarForm();
	$('.modal-loading').modal('hide');
	
	$('.btn-salvar').attr('acao','editar');
	
	
	function limpa_formulário_cep() {
        // Limpa valores do formulário de cep.
        $("#logradouro").val("");
        $("#bairro").val("");
        $("#cidade").val("");
        $("#uf").val("");
    }
    
	$("#cep").mask("99999-999");
	
    //Quando o campo cep perde o foco.
    $(".btn-buscar").on('click',function() {
    	
    	

        //Nova variável "cep" somente com dígitos.
        var cep = $('#cep').val().replace(/\D/g, '');
         console.log(cep)
        //Verifica se campo cep possui valor informado.
        if (cep != "") {

            //Expressão regular para validar o CEP.
            var validacep = /^[0-9]{8}$/;

            //Valida o formato do CEP.
            if(validacep.test(cep)) {

                //Preenche os campos com "..." enquanto consulta webservice.
                $("#logradouro").val("...");
                $("#bairro").val("...");
                $("#cidade").val("...");
                $("#uf").val("...");

                //Consulta o webservice viacep.com.br/
                $.getJSON("https://viacep.com.br/ws/"+ cep +"/json/?callback=?", function(dados) {

                    if (!("erro" in dados)) {
                        //Atualiza os campos com os valores da consulta.
                        $("#logradouro").val(dados.logradouro);
                        $("#bairro").val(dados.bairro);
                        $("#cidade").val(dados.localidade);
                        $("#uf").val(dados.uf);
                    } //end if.
                    else {
                        //CEP pesquisado não foi encontrado.
                        limpa_formulário_cep();
                        alert("CEP não encontrado.");
                    }
                });
            } //end if.
            else {
                //cep é inválido.
                limpa_formulário_cep();
                alert("Formato de CEP inválido.");
            }
        } //end if.
        else {
        	alert("DIGITE UM CEP.");
            limpa_formulário_cep();
        }
    });

});

function enviarForm(acao, id)
{
	$('.modal-loading').modal('show');
       
	var sendInfo = {
			id : id,
			nome : $("#nome").val(),
			descricao : $("#descricao").val(),
			endereco : {logradouro: $("#logradouro").val(), bairro: $("#bairro").val(), numero: $("#numero").val(), cep: $("#cep").val(), cidade:  $("#cidade").val(), uf: $("#uf").val()}
			
	}

	console.log(sendInfo)
	
	$.ajax(
	{
		type : 'PUT',
		url: `api/barbearia/editar`,
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify(sendInfo),
		error: function error(data)
		{
			toastr.options = {
					"closeButton": true,
					"debug": false,
					"newestOnTop": true,
					"progressBar": true,
					"positionClass": "toast-top-right",
					"preventDuplicates": true,
					"onclick": null,
					"showDuration": "300",
					"hideDuration": "1000",
					"timeOut": "2000",
					"extendedTimeOut": "3000",
					"showEasing": "swing",
					"hideEasing": "linear",
					"showMethod": "fadeIn",
					"hideMethod": "fadeOut"
				}
				toastr["error"](`${data.responseText}`)

		},
		//dataType: 'json',
		success: function success(data)
		{
			$('#modal-funcionario').modal('hide');
			toastr.options = {
				"closeButton": true,
				"debug": false,
				"newestOnTop": true,
				"progressBar": true,
				"positionClass": "toast-top-right",
				"preventDuplicates": true,
				"onclick": null,
				"showDuration": "300",
				"hideDuration": "1000",
				"timeOut": "2000",
				"extendedTimeOut": "3000",
				"showEasing": "swing",
				"hideEasing": "linear",
				"showMethod": "fadeIn",
				"hideMethod": "fadeOut",
				"onHidden": function ()
				{
					window.location.reload();
				}
			}
			toastr["success"](`Barbearia ${acao == "salvar" ? "salvo" : "editado"} com sucesso.`);

		}
	});
}

function validarForm()
{

	jQuery.validator.setDefaults({
	    errorPlacement: function (error, element) {
	        error.addClass('invalid-feedback');
	    },
	    highlight: function (element, errorClass, validClass) {
	        $(element).addClass('is-invalid');
	        $(element).removeClass('is-valid');
	    },
	    unhighlight: function (element, errorClass, validClass) {
	        $(element).removeClass('is-invalid');
	        $(element).addClass('is-valid');
	    }
	});
	
	
	
	
	var u_form = $("#form-barbearia").validate(
	{
		// Rules for form validation
		rules:
		{
			nome:
			{
				required: true
			}
			
		},messages:
		{
			nome:
			{
				required: 'Campo obrigatório'
			}
		},
		submitHandler: function submitHandler(form)
		{

			enviarForm($(".btn-salvar").attr("acao"), $(".btn-salvar").attr("data-id"))

		}
	});
}