var save = document.querySelector('.saveButton');
var data = document.querySelector('#html-data');
var download = document.querySelector('.download');
var page = document.querySelector('html');
var form = document.querySelector('#server');
var resume = document.querySelector('.page');


save.addEventListener('click', function(event){
    var parents = Array.prototype.slice.call(document.querySelectorAll('.parent'));
    parents.sort(function(a,b){
        return parseInt(a.style.top.split('-')[0]) - parseInt(b.style.top.split('-')[0]);    
    })
    document.querySelector('.sectionsmove').innerHTML = "";
    parents.forEach(function(item){
        document.querySelector('.sectionsmove').appendChild(item);
    });

    var info = Array.prototype.slice.call(document.querySelectorAll('.info'));
    for(let i=0; i<info.length;i++){
        let single = Array.prototype.slice.call(info[i].children);
        single.sort(function(a,b){
            return parseInt(a.style.top.split('-')[0]) - parseInt(b.style.top.split('-')[0]);    
        })
        info[i].innerHTML = "";
        single.forEach(function(item){
            info[i].appendChild(item);
        });
    }
    
    data.value = page.innerHTML;
    form.submit();
});

download.addEventListener('click', function(){
    var remove = Array.prototype.slice.call(document.querySelectorAll('.icon'));
    for(let i=0;i<remove.length;i++){
        remove[i].style.display = "none";
    }
    let $layout = $(document.querySelector('.sectionsmove'));
    $layout.packery('shiftLayout');
     html2canvas(document.querySelector('.download').parentNode,{
      scale:'5'
    }).then(function(canvas) {
      canvas.scale = 2;
      canvas.dpi = 144;
      var imgData = canvas;
      var imgWidth = 8.27; 
      var pageHeight = 11.69;  
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;
      
      var doc = new jsPDF('p', 'in');
      var position = 0;

      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      doc.save('Resume.pdf');
    });
});

