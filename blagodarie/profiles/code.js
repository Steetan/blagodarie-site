var link = window.location.href;
var url = new URL(link);


var link2 = window.location.href;
var url2 = new URL(link2);

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}
var setting;
settingSets.forEach((setting, i) => {
	if (setting.url.substr(0, setting.url.length - 1) == new URL(window.location.href).origin) {
		settings = setting;
	}
});




let new_settapi = settings.api;
let new_setturl = settings.url;



let user_table_body = document.querySelector('#user_table_body');

async function myProfilesinfo() {
		const response = await fetch(`${new_settapi}api/profile`, {
		method: "GET",
		headers: {
			"Authorization": 'Token ' + getCookie("auth_token")
		}
}).then(data => data.json());
	console.log(response);
	for(let i = 0; i<response.length; i++){
		console.log(response[i]);
		let tr = document.createElement('tr');
		tr.classList.add(response[i].uuid);
		
		tr.innerHTML = `<td><img src='${response[i].photo=="" ? settings.url+"/images/default_avatar.png" : response[i].photo}'/></td><td>${response[i].last_name + ' ' + response[i].first_name + ' ' + response[i].middle_name}</td><td><div class="bd_dd"><div class="bd_dd_cont"><p>${response[i].dob != null ? response[i].dob : ''}</p><p>|</p><p>${response[i].dod != null ? response[i].dod : ''}</p></div><div class="user_changed"><a class="user_changed_link" href="${window.location.origin}/?id=${response[i].uuid}&q=50&f=0"><i class="fa fa-link" aria-hidden="true"></i></a><div class="user_changed_info" onclick="user_changed_info('${response[i].uuid}', '${response[i].last_name}', '${response[i].first_name}', '${response[i].middle_name}', '${response[i].photo}', '${response[i].dob}', '${response[i].dod}')"><img src="${settings.url}images/pen.png"></div></div></div></td>`;
		user_table_body.append(tr); 
	}
}

window.onload = myProfilesinfo();






//редактировать профиль
function user_changed_info(id, last_name, first_name, middle_name, usr_photo, dob, dod){
	let add_user_profile_container = document.querySelector('.add_user_profile_container');
	let add_user_profile_close_popup = document.querySelector('.add_user_profile_close_popup');
	let user_profile_surname_inp = document.querySelector('.user_profile_surname_inp');
	let user_profile_name_inp = document.querySelector('.user_profile_name_inp');
	let user_profile_middlename_inp = document.querySelector('.user_profile_middlename_inp');
	let add_user_profile_photo = document.querySelector('.add_user_profile_photo');
	let add_user_profile_overbottom = document.querySelector('.add_user_profile_overbottom');
	let add_user_profile_bd = document.querySelector('.add_user_profile_bd');
	let add_user_profile_dd = document.querySelector('.add_user_profile_dd');
	let add_user_profile_mother_input = document.querySelector('.add_user_profile_mother_input');
	let add_user_profile_father_input = document.querySelector('.add_user_profile_father_input');
	let nophoto_but = document.querySelector('.nophoto_but');
	
	
	let warning1 = document.querySelector('.warning1');
	
	user_profile_surname_inp.value = '';
	user_profile_name_inp.value = '';
	user_profile_middlename_inp.value = '';
	add_user_profile_mother_input.value = '';
	add_user_profile_father_input.value = '';
	
	
	
	
	//обрезка файлов

	var bs_modal = $('#modal');
    var image = document.getElementById('image');
    var cropper,reader,file;
	var cropBoxData;
    var canvasData;

    $("body").on("change", ".image", function(e) {
        var files = e.target.files;
        var done = function(url) {
            image.src = url;
            bs_modal.modal('show');
        };
		

        if (files && files.length > 0) {
            file = files[0];

            if (URL) {
                done(URL.createObjectURL(file));
            } else if (FileReader) {
                reader = new FileReader();
                reader.onload = function(e) {
                    done(reader.result);
                };
                reader.readAsDataURL(file);
            }
        }
    });

    bs_modal.on('shown.bs.modal', function() {
        cropper = new Cropper(image, {
            aspectRatio: 1,
            /*viewMode: 3,
            preview: '.preview'*/
			autoCropArea: 0.5,
          	ready: function () {
            //Should set crop box data first here
            cropper.setCropBoxData(cropBoxData).setCanvasData(canvasData);
          }
        });
    }).on('hidden.bs.modal', function() {
       /* cropper.destroy();
        cropper = null;*/
		 cropBoxData = cropper.getCropBoxData();
        canvasData = cropper.getCanvasData();
        cropper.destroy();
    });

    $("#crop").click(function() {
        canvas = cropper.getCroppedCanvas({
            width: 160,
            height: 160,
        });//.toDataURL("image/png");
		
		console.log(canvas);
        canvas.toBlob(function(blob) {
            url = URL.createObjectURL(blob);
			console.log(url);
            var reader = new FileReader();
			console.log(reader);
            reader.readAsDataURL(blob);
            reader.onloadend = function() {
                var base64data = reader.result;
				//var new_ing = new Image();
				//new_ing.src = base64data;
				
				//start
				
				
				
				let str1 = base64data;
					//Обрезаем конец:
				var from1 = str1.search('base64') + 7; 
				var to1 = str1.length;
				let newstr1 = str1.substr(from1,to1);
				
				var form1 = new FormData();
				form1.append("uuid", id);
				form1.append("photo", newstr1);
				console.log(newstr1);

				var settings = {
  					"url": `${new_settapi}api/profile`,
  					"method": "PUT",
  					"timeout": 0,
  					"headers": {
  					  "Authorization": `Token ${getCookie("auth_token")}`
  					},
  					"processData": false,
  					"mimeType": "multipart/form-data",
  					"contentType": false,
  					"data": form1,
					success: function(){
						setTimeout(function(){
							window.location.reload();
						},1000)
					},
					error: function(){
						console.log('ошибка');
					}
					};

					$.ajax(settings).done(function (response) {
						
  						console.log(response);
					});
				
				
				
				
				
            };
        });
    });

	
	//обезличивание 
	
	
	function deleteacc(){
		var form12 = new FormData();
		form12.append("uuid", id);

		var settings = {
  		"url": `${new_settapi}api/profile`,
  		"method": "DELETE",
  		"timeout": 0,
  		"headers": {
    		"Authorization": `Token ${getCookie("auth_token")}`
  		},
  		"processData": false,
  		"mimeType": "multipart/form-data",
  		"contentType": false,
  		"data": form12,
		success: function(){
			warning1.innerHTML = '';
			setTimeout(function(){
				window.location.reload();
			},1000)
		},
			error: function(response){
				let first_resp = response.responseText;
				let pars1 = JSON.parse(first_resp);
				warning1.innerHTML = pars1.message;
			}
		};

		$.ajax(settings).done(function (response) {
  		console.log(response);
		});		
	}
	
	
	
	
	nophoto_but.addEventListener('click', function(){
		deleteacc();
	})
	
	
	
	//конец
	
	user_profile_surname_inp.value = last_name;
	user_profile_name_inp.value = first_name;
	user_profile_middlename_inp.value = middle_name;
	add_user_profile_bd.value = dob=='null'?'':dob;
	add_user_profile_dd.value = dod=='null'?'':dod;
	console.log(dod, add_user_profile_dd.value);
	console.log(dob, add_user_profile_bd.value);
	/*add_user_profile_bd.value = dob;
	add_user_profile_dd.value = dod;*/
	add_user_profile_photo.setAttribute('src', `${usr_photo == '' ? settings.url+'images/default_avatar.png' : usr_photo}`);
	
	
	add_user_profile_container.style.display = "block";
	console.log(id);
	console.log(last_name);
	console.log(first_name);
	console.log(middle_name);
	
	async function getUsparent() {
		const response = await fetch(`${settings.api}api/profile_genesis?uuid=${getCookie('user_uuid')}&depth=100`, {
		method: "GET",
		headers: {
			"Authorization": 'Token ' + getCookie("auth_token")
		}
}).then(data => data.json());
		/*for(let i = 0; i<response.connections.length; i++){
				if(response.connections[i].target == id && response.connections[i].is_mother == true){
					add_user_profile_mother_input.value = response.connections[i].source;
				}
				else if(response.connections[i].target == id && response.connections[i].is_father == true){
					add_user_profile_father_input.value = response.connections[i].source;
				}
			}*/
		for(let i = 0; i<response.connections.length; i++){
				if(response.connections[i].source == id && response.connections[i].is_mother == true){
					add_user_profile_mother_input.value = response.connections[i].target;
				}
				else if(response.connections[i].source == id && response.connections[i].is_father == true){
					add_user_profile_father_input.value = response.connections[i].target;
		}
	}
	}
	getUsparent()
	
	
	//Кнопка Сохранить
	add_user_profile_overbottom.addEventListener('click', function(){
		
		
		
		
		
		async function add_user_parents(operation_type_id, add_user_profile_mother_input){
	
				var settings = {
  					"url": `${new_settapi}api/addoperation`,
  					"method": "POST",
  					"timeout": 0,
  					"headers": {
    					"Authorization": `Token ${getCookie("auth_token")}`,
    					"Content-Type": "application/json"
  					},
  					"data": JSON.stringify({
    					"user_id_from": id,
    					"user_id_to": add_user_profile_mother_input,
    					"operation_type_id": operation_type_id
  					}),
					success: function(response){
						warning1.innerHTML = '';
					},
					error: function(response){
						let first_resp = response.responseText;
						let pars1 = JSON.parse(first_resp);
						warning1.innerHTML = pars1.message;
					}
					};

					$.ajax(settings).done(function (response) {
  					console.log(response);
					});
			
		
}
		
		
		async function myProfilesinfo() {
		const response = await fetch(`${settings.api}api/profile_genesis?uuid=${getCookie('user_uuid')}&depth=100`, {
		method: "GET",
		headers: {
			"Authorization": 'Token ' + getCookie("auth_token")
		}
}).then(data => data.json());		
			//var b;
			if(add_user_profile_mother_input.value.includes('id')){
				/*let str = add_user_profile_mother_input.value;
					//Обрезаем конец:
				var from = str.search('id=') + 3; 
				var to = str.length;
				let newstr = str.substr(from,to);
				console.log(newstr);
				add_user_profile_mother_input.value = newstr;*/
				url2.href = add_user_profile_mother_input.value;
				let newstr = url2.searchParams.get('id');
				add_user_profile_mother_input.value = newstr;
				console.log(newstr);
			}
			//var b;
			if(add_user_profile_father_input.value.includes('id')){
				/*let str3 = add_user_profile_father_input.value;
					//Обрезаем конец:
				var from3 = str3.search('id=') + 3; 
				var to3 = str3.length;
				let newstr3 = str3.substr(from3,to3);
				console.log(newstr3);
				add_user_profile_father_input.value = newstr3;*/
				//
				url.href = add_user_profile_father_input.value;
				let newstr3 = url.searchParams.get('id');
				add_user_profile_father_input.value = newstr3;
				console.log(newstr3);
			}
			console.log(response);
			let users_resp = [];
			for(let i = 0; i<response.connections.length; i++){
				/*
				if(response.connections[i].target == id){
					if(response.connections[i].source == add_user_profile_mother_input.value && response.connections[i].target == id && response.connections[i].source == add_user_profile_father_input.value && response.connections[i].target == id){
					   console.log('То же что и было');
					}else{
						if(add_user_profile_mother_input.value!= '' && response.connections[i].is_mother == true){
						add_user_parents(7, response.connections[i].source);
						add_user_parents(8, add_user_profile_mother_input.value);
						}
						if(add_user_profile_mother_input.value!= '' && response.connections[i].is_mother == false){
							add_user_parents(8, add_user_profile_mother_input.value);
						}
						if(add_user_profile_mother_input.value == '' && response.connections[i].is_mother == true){
							add_user_parents(7, response.connections[i].source);
						}
						//father
						if(add_user_profile_father_input.value!= '' && response.connections[i].is_father == true){
						add_user_parents(7, response.connections[i].source);
						add_user_parents(6, add_user_profile_father_input.value);
						}
						if(add_user_profile_father_input.value!= '' && response.connections[i].is_father == false){
							add_user_parents(6, add_user_profile_father_input.value);
						}
						if(add_user_profile_father_input.value == '' && response.connections[i].is_father == true){
							add_user_parents(7, response.connections[i].source);
						}*/
						
						
					/*}
				}
				else{
					
					/*users_resp.push('none');
				}*/
				
				
				if(response.connections[i].source == id){
					if(response.connections[i].target == add_user_profile_mother_input.value && response.connections[i].source == id && response.connections[i].target == add_user_profile_father_input.value && response.connections[i].source == id){
					   console.log('То же что и было');
					}else{
						if(add_user_profile_mother_input.value!= '' && response.connections[i].is_mother == true){
						add_user_parents(7, response.connections[i].target);
						add_user_parents(8, add_user_profile_mother_input.value);
						}
						if(add_user_profile_mother_input.value!= '' && response.connections[i].is_mother == false){
							add_user_parents(8, add_user_profile_mother_input.value);
						}
						if(add_user_profile_mother_input.value == '' && response.connections[i].is_mother == true){
							add_user_parents(7, response.connections[i].target);
						}
						//father
						if(add_user_profile_father_input.value!= '' && response.connections[i].is_father == true){
						add_user_parents(7, response.connections[i].target);
						add_user_parents(6, add_user_profile_father_input.value);
						}
						if(add_user_profile_father_input.value!= '' && response.connections[i].is_father == false){
							add_user_parents(6, add_user_profile_father_input.value);
						}
						if(add_user_profile_father_input.value == '' && response.connections[i].is_father == true){
							add_user_parents(7, response.connections[i].target);
						}
						
						
					}
				}
				else{
					
					users_resp.push('none');
				}
				
				
				
			}
			
			if(response.connections.length == users_resp.length){
				if(add_user_profile_father_input.value!= ''){
					add_user_parents(6, add_user_profile_father_input.value)
				}
				if(add_user_profile_mother_input.value!= ''){
					add_user_parents(8, add_user_profile_mother_input.value)
				}
				console.log(users_resp);
				//add_user_parents(8, add_user_profile_mother_input.value)
			}
		}
		myProfilesinfo();
		
		
		//add_user_parents(7);
		//add_user_parents(6);
		
		
		
	
		//alert(`${day}-${month}-${year}`)
		
		
		var formdata = new FormData();
		formdata.append("uuid", id);
		formdata.append("first_name", user_profile_name_inp.value);
		formdata.append("last_name", user_profile_surname_inp.value);
		formdata.append("middle_name", user_profile_middlename_inp.value);
		formdata.append("dob", add_user_profile_bd.value);
		formdata.append("dod", add_user_profile_dd.value);
		/*async function add_gen(){
		const response = await fetch(`${settings.api}api/profile`, {
		method: "PUT",
		headers: {
			"Authorization": `Token ${getCookie("auth_token")}`
		},
		body: formdata
	}).then(response => response.ok ? response.text() /*&& window.location.reload()*//* : console.log(response))
	.then(result => console.log(result))
	.catch(error => console.log('error', error));
	
	
}*/
	function add_gen(){	
		var settings = {
  					"url": `${new_settapi}api/profile`,
  					"method": "PUT",
  					"timeout": 0,
  					"headers": {
  					  "Authorization": `Token ${getCookie("auth_token")}`
  					},
  					"processData": false,
  					"mimeType": "multipart/form-data",
  					"contentType": false,
  					"data": formdata,
					success: function(response){
						console.log(response);
						warning1.innerHTML = '';
					},
					error: function(response){
						let first_resp = response.responseText;
						let pars1 = JSON.parse(first_resp);
						warning1.innerHTML = pars1.message;
					}
					};

					$.ajax(settings).done(function (response) {
						//url.searchParams.append('add_new_user', )
						
					});
		
		
		
		
	}
		
		add_gen();
		
		
		setTimeout(function(){
			if(warning1.innerHTML == ''){
				window.location.reload();
			}
		}, 3500)
	});
	
	
	
	
	//закрыть попап
	add_user_profile_close_popup.addEventListener('click', function(){
		if(user_profile_surname_inp.value != last_name || user_profile_name_inp.value != first_name || user_profile_middlename_inp.value != middle_name){
			let user_profile_not_save = confirm('Есть несохранённые данные. Всё равно закрыть?');
			if(user_profile_not_save == true){
				window.location.reload();
			}
		}else{
		window.location.reload();
		}
	})
	
}

window.onload = function(){
if(localStorage.getItem('npuuid')){
	//let firstName;
	//if(localStorage.getItem('fName')){
		//firstName = localStorage.getItem('fName')
	//}
	 user_changed_info(localStorage.getItem('npuuid'), localStorage.getItem('lastName'), localStorage.getItem('fName'), localStorage.getItem('midName'), '', null, null);
	localStorage.removeItem('npuuid');
	localStorage.removeItem('fName');
	localStorage.removeItem('lastName');
	localStorage.removeItem('midName')
}
}





//Добавить новый профиль
let new_api_str = settings.api
let add_profile_but = document.querySelector('.add_profile_but');
let add_user_profile_container_prew = document.querySelector('.add_user_profile_container_prew');
add_profile_but.addEventListener('click', function(){
	add_user_profile_container_prew.style.display = 'block';
	let add_user_profile_close_popup_new = document.querySelector('.add_user_profile_close_popup_new');	
	let user_profile_surname_inp = document.querySelector('#user_profile_surname_inp');
	let user_profile_name_inp = document.querySelector('#user_profile_name_inp');
	let user_profile_middlename_inp = document.querySelector('#user_profile_middlename_inp');
	let add_user_profile_overbottom = document.querySelector('#add_user_profile_overbottom');
	let error_in_add = document.querySelector('.error_in_add');
	let new_profile_user_uuid;
	/*let user_profile_middlename_inp = document.querySelector('.user_profile_middlename_inp');
	let add_user_profile_bd = document.querySelector('.add_user_profile_bd');
	let add_user_profile_dd = document.querySelector('.add_user_profile_dd');
	let add_user_profile_mother_input = document.querySelector('.add_user_profile_mother_input');
	let add_user_profile_father_input = document.querySelector('.add_user_profile_father_input');
	let new_uuid;
	var formdata = new FormData();*/
	
	console.log(settings);
	//let new_api_str = settings.api;
	user_profile_name_inp.value = '';
	user_profile_surname_inp.value = '';
	user_profile_middlename_inp.value = '';
	
	
	//закрыть попап
	add_user_profile_close_popup_new.addEventListener('click', function(){
		
		window.location.reload();
		
	})
	
	//Создание юида
	//add_user_profile_overbottom.addEventListener('click', function(){
			
		
	
	add_user_profile_overbottom.addEventListener('click', function(){
		var form = new FormData();
	if(user_profile_name_inp.value != ''){
	form.append("first_name", user_profile_name_inp.value);
	}
	if(user_profile_surname_inp.value != ''){
		form.append("last_name", user_profile_surname_inp.value);
	}
	if(user_profile_middlename_inp.value != ''){
		form.append("middle_name", user_profile_middlename_inp.value);
	}
	
				var settings = {
  					"url": `${new_api_str}api/profile`,
  					"method": "POST",
  					"timeout": 0,
  					"headers": {
  					  "Authorization": `Token ${getCookie("auth_token")}`
  					},
  					"processData": false,
  					"mimeType": "multipart/form-data",
  					"contentType": false,
  					"data": form,
					success: function(response){
						console.log(response)
						let str1 = response;
						let pars1 = JSON.parse(str1);
						new_profile_user_uuid = pars1.uuid;
						let last_name = pars1.last_name;
						let fName;
						//if(user_profile_name_inp!=''){
							fName = pars1.first_name;
						let midName = pars1.middle_name
						//}
						console.log(pars1);
						localStorage.setItem('npuuid', new_profile_user_uuid);
						localStorage.setItem('lastName', last_name);
						//if(user_profile_name_inp!=''){
							localStorage.setItem('fName', fName);
						localStorage.setItem('midName', midName);
						//}
						
						
						window.location.reload();
						
						/*formdata.append("uuid", new_uuid);
						formdata.append("first_name", user_profile_name_inp.value);
						formdata.append("last_name", user_profile_surname_inp.value);
						formdata.append("middle_name", user_profile_middlename_inp.value);
						formdata.append("dob", add_user_profile_bd.value);
						formdata.append("dod", add_user_profile_dd.value);
						add_detail_profile_info()*/
					},
					error: function(response){
						//let str1 = response;
						//let pars1 = JSON.parse(str1);
						//console.log(pars1);
						let first_resp = response.responseText;
						let pars1 = JSON.parse(first_resp);
						error_in_add.innerHTML = pars1.message;
					}
					};

					$.ajax(settings).done(function (response) {
						//url.searchParams.append('add_new_user', )
						
					});
		})
					
						/*async function add_detail_profile_info(){
						const response = await fetch(`${new_api_str}api/profile`, {
						method: "PUT",
						headers: {
							"Authorization": `Token ${getCookie("auth_token")}`
						},
						body: formdata
						}).then(response => response.ok ? response.text() && window.location.reload() : console.log('bad'));
	
	
						}
						*/
						
		
		
		
		
		
		
		
	//});
	
	
	
	
	
})











//Добавить картинку род

let gen_container = document.querySelector('.gen_container');
let div = document.createElement('div');
div.innerHTML = `<img src="${settings.url}images/genesis.png" />`;
gen_container.append(div);

//кнопка род

gen_container.addEventListener('click', function(){
	window.location.href = window.location.origin + '/gen';
})

