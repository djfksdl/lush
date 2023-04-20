// jQuery
$(document).ready(function(){
    
    const section = $('.wrap > section')
    const footer = $('.footer')
    let sectionSpeed = 500;

    let sectionPos= [];
    // 각각의 section의 위치값 저장. 홈페이지 리사이즈 되었을때
    let sectionIndex = 0;
    // 인덱스값도 필요함. 디폴트로 0 저장되어있음.
    let scrolling = false;
    // false일때 연속 휠 막기. section 내릴때 막 휠해도 한section만 내려가게 하기위해
    // true일때 풀페이지 모드 on / false일때 fullpage모드 off 
    let wheeling = true;
    const sectionMenu = $('.section-menu')
    // 화면 사이즈 체크
    // 화면 너비 1000px 이하에서는 휠작동시켜도 fullpage식 섹션 전환이 되지 않게 막아주는 변수
    // true일때 풀페이지식 섹션전환이 작동됨. 

    function wheelCheckFn(){
        let windowWidth = window.innerWidth;
        // 윈도우가 1000이하면 풀페이지 모드 off + section메뉴 없앰
        if(windowWidth <=1055){
            wheeling = false;
            sectionMenu.hide();
        }else{
            wheeling = true;
            sectionMenu.show();
        }
        // console.log(windowWidth)
    }
    wheelCheckFn();
    function resetSection(){
        sectionPos=[];
        $.each(section,function(index,item){
            let tempY = $(this).offset().top;
            // this는 여러 section중에 하나하나씩 첫번째면 첫번째, 두번째면 두번째섹션
            // 받는 값은 index값이다. 이건 약속이다. 
            // console.log(index + ":" + tempY)
            tempY = Math.ceil(tempY);
            sectionPos[index] = tempY; 
            
        })
        sectionPos[sectionPos.length]=Math.ceil(footer.offset().top)
        console.log(sectionPos);
        // 0~6번방과 푸터를 저장한다?
    }
    // 최초에 새로고침 또는 실행시 위치값파악 => sectionPos배열에 저장
    resetSection();
    // 
    let sectionTotal = sectionPos.length;

    $(window).resize(function(){
        wheelCheckFn();
        // 너비체크
        resetSection();
        // 위치체크
        if(wheeling){
            // gsap.새($(요소명),durationTime.{설정})
            gsap.to($('html'),sectionSpeed/1000,{
                // 1000으로 나누면 0.5초 이렇게 나옴
                scrollTop:sectionPos[sectionIndex],
                onComplete: function(){
                    scrolling: false;
                }
                // 리사이즈될때 스크롤탑을 섹션 위치로 움직여라
                // ex) 위치가 이렇게 [0,734,1400,1500,2000]일때 위치가 1200에 있을때 734인 1번 index(0부터 시작하니까) 734의 index값인 1이 값에 들어간다.
            })
        }
    })
    //스크롤바의 위쪽 위치값을 파악한다.
    $(window).scroll(function(){
        if(wheeling){
            return;
            // wheeling이 트루되어있으면 아무것도 안하고 나감 
        }
        let tempY = $(window).scrollTop();
        tempY=Math.ceil(tempY);
        for(let i = sectionTotal-1; i>=0; i--){
            let tempMax = sectionPos[1];
            if(tempY >=tempMax){
                sectionIndex=i;
                break;
            }
            // 요소.오프셋탑은 그 요소의 위치, 스크롤탑은 스크롤한 양이다. 
            // 섹션 index번호와 스크롤양을 비교해서 해당하는 섹션 index값을 찾아줌. 현재 위치에 해당하는 section번호를 넘겨줌.
        }

    })
    
    // $(window).bind('mousewheel', function(event){
    //     if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
    //         // scroll up
    //         console.log("스크롤 위로");
    //         // wheel델타값이 양수이거나 detail이 음수이면,"스크롤 위로"
    //     }
    //     else {
    //         // scroll down
    //         console.log("스크롤 아래로");
    //     }
    // });
    let resizeTimer;
    $(window).bind('resize', function(){
        window.clearTimeout(resizeTimer);
        resizeTimer=window.setTimeout
        (resizeFunction,500)
    })
    function resizeFunction(){
        //리사이즈시 실행할 코드
        wheelCheckFn();
        // 너비체크
        resetSection();
        // 위치체크
        if(wheeling){
            // gsap.새($(요소명),durationTime.{설정})
            gsap.to($('html'),sectionSpeed/1000,{
                // 1000으로 나누면 0.5초 이렇게 나옴
                scrollTop:sectionPos[sectionIndex],
                onComplete: function(){
                    scrolling: false;
                }
                // 리사이즈될때 스크롤탑을 섹션 위치로 움직여라
                // ex) 위치가 이렇게 [0,734,1400,1500,2000]일때 위치가 1200에 있을때 734인 1번 index(0부터 시작하니까) 734의 index값인 1이 값에 들어간다.
            })
        }

    }
    // 마우스 휠체크
    $(window).bind('mousewheel DOMMouseScroll',function(event){
        let distance = event.originalEvent.wheelDelta;
        if (distance == null) {
            distance = event.originalEvent.detail * -1;
        }
        console.log(distance)
        // 화면 사이즈에 따른 작동여부
        if (wheeling != true) {
            return;
        }
        // wheeling이 트루일때 연속휠 막아준다
        if (scrolling) {
            return;
        }
        

        // 연속휠 작동 막기
        scrolling=true;
        if(distance < 0){
            sectionIndex++;
            if(sectionIndex >= sectionTotal){
                sectionIndex = sectionTotal-1;
            }
            console.log(sectionIndex)
        }else {
            sectionIndex--;
            if(sectionIndex <=0){
                sectionIndex=0;
            }
            console.log(sectionIndex)
        }
        gsap.to($('html'), sectionSpeed/1000, {
            scrollTop: sectionPos[sectionIndex],
            // scrollTo 대신 scrollTop으로 해도됨. 어디까지 이동할때 쓰이는거
            onComplete: function(){
                scrolling=false
            }
        })
        sectionColor();
        // 스크롤할때 색깔 바뀌게 하기
    })
    // 섹션메뉴클릭시 섹션이동
    const sectionLink = $('.section-menu a')
        // console.log(sectionLink)
    $.each(sectionLink, function(index, item){
        $(this).click(function(e){
            e.preventDefault();
            // gsap.to($('html'), sectionSpeed/1000, {
            //     scrollTop: sectionPos[index],
              
            //     onComplete: function(){
            //         scrolling=false;
            //     }
            // })
            moveSection(index);
            sectionColor();
        })
    })
    function moveSection(_index){
        sectionIndex = _index;
        gsap.to($('html'),sectionSpeed/1000,{
            scrollTo:sectionPos[sectionIndex],
            onComplete:function(){
                scrolling=false;
            }
        })
    }
    function sectionColor(){
        // 포커스 표현
        sectionLink.removeClass('section-menu-active')
        // 전역변수라 조작되는거에 따라 변함. 그래서 let sectionLink로 주면 안됨. 그럼 지역변수로 바껴서 실행이 안됨
        sectionLink.eq(sectionIndex).addClass('section-menu-active')
        // 색상 표현
        sectionLink.removeClass('section-menu-blue')
        sectionLink.eq(sectionIndex).addClass('section-menu-blue')
    }
    // 최초 또는 새로고침시 셋팅
    sectionColor();

    // 탑배너 숨기기
    $(window).scroll(function(event){
            let st = $(this).scrollTop();
            console.log(st)
            if(st>386){
              $('.top_banner').addClass('hide')
              $('.menu').addClass('up')
            }else {
              $('.top_banner').removeClass('hide')
              $('.menu').removeClass('up')
            }
          })
    // 모바일 메뉴 기능
    // .mb-bt를 저장해서 활용하자
    $('.mb-bt').click(function(e){
        e.preventDefault();
        $('.mb-bt').toggleClass('mb-bt-open')
        // $('this').toggleClass('mb-bt-open') 라고도 씀.
        $('.mb-menu-mask').toggleClass('mb-menu-mask-active')
        $('.mb-nav').toggleClass('mb-nav-open')
        $('.mb-menu >li').height(54)
        // 마지막꺼 안하면 정리안된채로 나옴
        $('.mb-mainmenu').removeClass('mb-mainmenu-open')
      })
      // e는 받아오는 매게변수 공간만 있으면 됨. e꼭 안써도됨. 
      
      // 화면사이즈체크
      $(window).resize(function(){
        let temp = $(window).width();
        // let temp = window.innerWidth();
        // console.log(temp)
        if(temp > 1055) {
          $('.mb-bt').removeClass('mb-bt-open')
        $('.mb-menu-mask').removeClass('mb-menu-mask-active')
        $('.mb-nav').removeClass('mb-nav-open')
        }else {
          $('.all-menu-wrapper').removeClass('all-menu-wrapper-active')
          $('.all-menu-mask').removeClass('all-menu-mask-active')
        }
      })
      // 모바일 메뉴 펼치기 기능
      // 1. 모바일 메뉴 불러오기
      const mb_mainmenu = $('.mb-mainmenu')
      
      // 2. 모바일 서브메뉴 불러오기
      const mb_submenu = $('.mb-submenu')
  
      // 3. 펼쳐진 서브메뉴의 높이값
      let mb_submenu_height = [];
      // []배열
      
      // 4. 높이값 계산을 실행
      // 배열명.forEach(function(item,index){할일})
      // $.each(배열명, function(index, item){할일})
      // each도 index로 객체를 넘겨줌. 그러나 순서가 다름. 인덱스 아이템(또는 element)
      $.each(mb_submenu, function(index){
        // 각각의 .mb-submenu로 가서
        // li의 개수를 한다.
        let count = $(this).find('li').length;
        // this 는 mb_submenu를 의미
        // console.log(count)
        // 최종결과 저장(51px*count+22) <=51이 5개 있고 패딩값 11 두개 합치면..!
        mb_submenu_height[index]= 51*count+22;
      })
      // console.log(mb_submenu_height)
      let mb_li = $ ('.mb-menu > li')
      $.each(mb_mainmenu,function(index){
  
        $(this).click(function(e){
          e.preventDefault();
          // mb-mainmenu-open이 있으면 펼치고 없으면 닫기
        $(this).toggleClass('mb-mainmenu-open')
        let active = $(this).hasClass('mb-mainmenu-open')
        if(active) {
          let temp = mb_submenu_height[index]
          // 해당되는 (클릭된)  li>a(depth1)의 ul의 높이값을 temp에 저장
          mb_li.eq(index).height(temp+54)
          // 해당요소의 높이부여 
          // eq은 equal 인데 
          mb_li.eq(index).siblings().height(54)
            $(this).toggleClass('mb-mainmenu-open')
          }else {
            // 클릭이 안된경우
            mb_li.eq(index).height(54)
            //index[]은 반복문이라 첫번째것 index[0]이다.
            // (index)는 반복은 아닌데 연동되는 0에 해당되는li, 건드리면되기때문에 eq을 적어줌.
            // eq이나 each 많이씀!
          }      
        })
      })
      // 모바일 메뉴 배경을 클릭시 사라짐
      const mb_menu_mask = $('.mb-menu-mask')
      mb_menu_mask.click(function(){
        // 모바일 버튼 기능 초기화
        $('.mb-bt').removeClass('mb-bt-open')
        $('.mb-menu-mask').removeClass('mb-menu-mask-active')
        $('.mb-nav').removeClass('mb-nav-open')
        $('.mb-menu >li').height(54)
        $('.mb-mainmenu').removeClass('mb-mainmenu-open')
      })
});


// vanilla Javascript
window.onload = function(){
    
};
// 메인베너 슬라이드
var swiper = new Swiper(".m_v_Swiper", {
    slidesPerView: "auto",
  spaceBetween: 0,
  // centeredSlides: true,
  autoplay: {
      delay: 5000,
      disableOnInteraction: false,
  },
  loop:true,
  pagination: {
      el: ".m_v_swiper-pagination",
      clickable: true,
  },
  navigation: {
      nextEl: ".m_v_swiper-button-next",
      prevEl: ".m_v_swiper-button-prev",
  },
  });
  // 베스트 상품 스와이퍼
  var swiper = new Swiper(".best_Swiper", {
    slidesPerView: 1,
    spaceBetween: 10,
  scrollbar: {
    el: ".swiper-scrollbar",
  },
  navigation: {
      nextEl: ".b_swiper-button-next",
      prevEl: ".b_swiper-button-prev",
  },
breakpoints: {
  "@0.00": {
    slidesPerView: 1,
    spaceBetween: 0,
  },
  "@0.75": {
    slidesPerView: 2,
    spaceBetween: 0,
  },
  "@1.00": {
    slidesPerView: 3,
    spaceBetween: 20,
  },
  "@1.50": {
    slidesPerView: 4,
    spaceBetween: 30,
  },
},
  });
//   스토어 스와이퍼
var swiper = new Swiper(".store_Swiper", {
    spaceBetween: 0,
    centeredSlides: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    loop:true,
    });
// gotop_btn    

    $(function () {
        $(window).scroll(function(){
            if($(this).scrollTop()>=300){
                $('.gotop_btn').fadeIn(300)
            }else{
                $('.gotop_btn').fadeOut(300)
            }
            
        })
        $('.gotop_btn').click(function(e){
            e.preventDefault()
            $('html, body').stop().animate({scrollTop:0},500)
        })
    });
    