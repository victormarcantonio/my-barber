$(document).ready(function (){
	
	$(".app-menu__item").removeClass('active')
	$(".app-menu__item.dashboard").addClass('active')
	
	var hoje = moment().format('MM/YYYY');
	
	$(".titulo-grafico-mensal").text(`Agendamentos ${hoje}`);
	
	var dadosUsuario = getAtributoUsuarioJWT().dadosUsuario;
	console.log(dadosUsuario)
	$("#desc-barbearia").text(`Barbearia ${dadosUsuario.nomeBarbearia}`)
	
	graficoAnual();
	preencherInformacoes();
	graficoStatusAgendamentosMensal();
	
	

});  

function preencherInformacoes(){
	

	$.ajax(
			{
				type: "Patch",
				url: `api/barbearia/${getIdBarbearia(getToken())}`,
				cache: false,
				beforeSend: function (request) {
					request.setRequestHeader("Authorization", `Bearer ${getToken()}`);
			    },
				error: function error(data)
				{
					
					console.log(data)

				},
				success: function (data)
				{
					$("#qtd-funcionario").text(data.qtdFuncionario);
					$("#qtd-cliente").text(data.qtdCliente);
					$("#qtd-servico").text(data.qtdServico);
				}
			});
}

function graficoStatusAgendamentosMensal(){
	
	$.ajax({
		url: `api/agendamentos/dados-grafico-status-mensal/${getIdBarbearia(getToken())}`,
		beforeSend: function (request) {
			request.setRequestHeader("Authorization", `Bearer ${getToken()}`);
	    },
		error: function error(data)
		{
			console.log(data)
			
		},
		success: function(result){
			
			console.log(result)
			
			var pdata = [ {
				value : result.CONCLUIDO ? result.CONCLUIDO : 0,
				color : "#2874A6",
				//highlight : "#5AD3D1",
				label : "Concluido"
			}, {
				value : result.AGENDADO ? result.AGENDADO : 0,
				color : "#F1C40F",
				//highlight : "#FF5A5E",
				label : "Agendado"
			} ,
			 {
				value : result.CANCELADO ? result.CANCELADO : 0,
				color : "#EC7063",
				//highlight : "#FF5A5E",
				label : "Cancelado"
			}]  
			
	
			var ctxp = $("#pieChartDemo").get(0).getContext("2d");
			var pieChart = new Chart(ctxp).Pie(pdata);
		}
		
	});
}

function graficoAnual(){
	
	$.ajax({
		url: `api/agendamentos/somaValorMensal/${getIdBarbearia(getToken())}`,
		beforeSend: function (request) {
			request.setRequestHeader("Authorization", `Bearer ${getToken()}`);
	    },
		error: function error(data)
		{
			console.log(data)
			
		},
		success: function(result){

		  var labels = [];
		  var data = [];

		   var mesValor = {
					1: 0,
					2: 0,
					3: 0,
					4: 0,
					5: 0,
					6: 0,
					7: 0,
					8: 0,
					9: 0,
					10: 0,
					11: 0,
					12: 0
				} ; 
			
			
			result.forEach(function(e){
				
				mesValor[e.mes] = e.valor;
				
			});


			Object.entries(mesValor).forEach(function(e){
				labels.push(converterMeses(e[0]));
				data.push(e[1].toFixed(2));
			});
			

		   var dataGraficoAnual = {
			      	labels: labels,
			      	datasets: [
			      		{
			      			fillColor: "rgba(151,187,205,0.2)",
			      			strokeColor: "rgba(151,187,205,1)",
			      			pointColor: "rgba(151,187,205,1)",
			      			pointStrokeColor: "#fff",
			      			pointHighlightFill: "#fff",
			      			pointHighlightStroke: "rgba(151,187,205,1)",
			      			data: data
			      		}
			      	]
			      };
			
		   
		    
			var ctxb = $("#lucro-anual").get(0).getContext("2d");
			
			var options = {
				    animation: false,
				    scaleLabel:
				    function(label){return 'R$' + label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");}
				};
			
		    var barChart = new Chart(ctxb).Bar(dataGraficoAnual);
	
			
		}
});

}

function converterMeses(mesInt){
	
	meses = {
		1:'Jan',
		2:'Fev',
		3: 'Mar',
		4: 'Abr',
		5 : 'Mai',
		6: 'Jun',
		7: 'Jul',
		8: 'Ago',
		9: 'Set',
		10: 'Out',
		11: 'Nov',
		12: 'Dez'
	}
	
	return meses[mesInt];
};


function getCorMes(mes){
	
	cores = {
		'AGENDADO':'#F1C40F',
		'CANCELADO':'#EC7063',
		'CONCLUIDO': '#2874A6'
	}
	
	return cores[mes];
};


