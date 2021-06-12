$(document).ready(function(){
	$(".b-calendar__number .select").click(function(e){
        var el = $(this);
        var dataEvent = el.data("event");
        $(".b-calendar__number a.active").removeClass("active");
        el.addClass("active");
		//путь к файлу с компонентом. ”казываем параметр
		var pathProjects = TEMPLATE_PATH+"/ajax.php?ajax=Y";
		//делаем ajax запрос и сразу инкремент номера страницы
		$.get(pathProjects, {
                DATA_EVENT: dataEvent,
                CATALOG_ID: CATALOG_ID,
                LANGUAGE_ID: LANGUAGE_ID,
                act: "events"
            }, function(data){
			//заменим проекты
            //alert(data);
            $(".list").empty();
			$(".list").append(data);
            $(".news-list-nav").empty();
		});
		e.preventDefault();
        //отключим скролл к верху документа
		return false;
	});
});