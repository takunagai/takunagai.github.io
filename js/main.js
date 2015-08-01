/**
 * ------------------------------------------------------------
 * main.js v0.9.1 2014-09-30
 * Author: taku_n
 *
 * 各ページで使う共通のスクリプト
 */

/**
 * Documentオブジェクトをキャッシュして高速化
 * @link http://d.hatena.ne.jp/amachang/20071010/1192012056
 */
var _doc = document;



/**
 * 横に並んだ要素の高さを揃える (列IE7,8も対応)
 *
 * Equal Height Blocks in Rows by CHRIS COYIER(CSS Tricks) を改変したもの
 * @link http://css-tricks.com/equal-height-blocks-in-rows/
 * @link http://codepen.io/micahgodbolt/full/FgqLc
 * It's been modified into a function called at page load and then each time the page is resized.
 * One large modification was to remove the set height before each new calculation.
 * Usage : 要素をセットして実行
 */
(function(){
  //関数定義
  var equalheight = function(container) {

    var currentTallest = 0,
      currentRowStart = 0,
      rowDivs = [],
      $el,
      topPosition = 0;

    $(container).each(function() {

      $el = $(this);
      $($el).height('auto'); //added
      topPosition = $el.position().top;

      var currentDiv;

      if (currentRowStart !== topPosition) {

        // we just came to a new row.  Set all the heights on the completed row
        for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
          rowDivs[currentDiv].height(currentTallest);
        }

        // set the variables for the new row
        rowDivs.length = 0; // empty the array
        currentRowStart = topPosition;
        currentTallest = $el.height();
        rowDivs.push($el);
      }
      else {
        // another div on the current row.  Add it to the list and check if it's taller
        rowDivs.push($el);
        currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);
      }
      // do the last row
      for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
        rowDivs[currentDiv].height(currentTallest);
      }
    });
  };

  // 実行（ページ読み込み時、リサイズ時） excute when the page is roaded/resized
  //★★配列で処理、ループ内ではfunction使うのはJSHint通らないのでfunctionをループ外に定義する
  //var elm1 = '#nav-inner>ul>li>a';//メインメニュー
  var elm2 = '.grid-block .cell';//グリッドブロックレイアウト

  //ページ読み込み時
  $(function() {
    if($(elm2).length){ equalheight(elm2); }
  });
  // jQuery非使用時
  // $(window).load(function() {
  //   //if($(elm1).length){ equalheight(elm1); }//適用したい要素をセット
  //   if($(elm2).length){ equalheight(elm2); }
  // });

  //リサイズ時。Timerを使いリサイズ終了時のみ処理（参考:http://kadoppe.com/archives/2012/02/jquery-window-resize-event.html）
  var timerEqualheight = false;
  $(window).resize(function() {
    if (timerEqualheight !== false) {
      clearTimeout(timerEqualheight);
    }
    timerEqualheight = setTimeout(function() {
      //if($(elm1).length){ equalheight(elm1); }
      if($(elm2).length){ equalheight(elm2); }
    }, 200);
  });
})();


/**
 * 目次の生成 (目次にしたい要素が1つなら非表示、2つ以上で表示される)
 *
 * @param {String} str 目次にしたい要素。無ければデフォルト値 "article > h2" が適用
 * Usage : テンプレートの目次を設置したい箇所に <div class="page-index"></div> を設置
 * @author taku_n
 * @url ★★https://gist.github.com/
 * 参考：http://www.jankoatwarpspeed.com/examples/table-of-contents/demo1.html
 */
(function() {
  var generateTableOfContents = function(headers) {
    headers = headers || $('article > h2');//デフォルト値
    if(headers.length >= 2) {
      var elm = $('<ul />');
      headers.each(function(i) {
        var current = $(this);
        current.attr('id', 'chapter_' + i);
        elm.append('<li><a href="#chapter_' + i + '">' + current.html() + '</a></li>');
      });
      $('.page-index')
        .append('<p><i class="fa fa-list-alt"></i> このページの目次 <small>(クリックで移動)</small></p>')
        .append(elm);
      return false;
    }
    else {
      $('.page-index').css('display', 'none');
    }
  };
  $(function() {
    generateTableOfContents();//目次にしたい要素を指定(複数ならカンマ区切り)
  });
})();


$(function() {
  /**
  * ページ内スムーススクロール 3/3
  * lodash(Underscore.js) の throttleメソッドで処理頻度を抑制
  *     https://gist.github.com/takunagai/457302aaa44421bbc958
  *     サンプル：http://codepen.io/oreo3/pen/JjHDz
  */
  $('a[href^="#"], area[href^="#"], a[href=""], area[href=""]').on('click', function(e) {
    var href= $(this).attr('href');
    var target = $(href === '#top' || href === '#' || href === '' ? 'html' : href);
    var isSafari = /Safari/.test(navigator.userAgent);
    $(isSafari ? 'body' : 'html').animate({scrollTop:target.offset().top});
    e.preventDefault();
  });

  /**
   * ページ上部へ戻るボタン
   *     画面右下固定表示。スクロールで表示/非表示
  */
  // Setting
  var topBtn = $('#move-to-page-top'),//ページTopに戻るボタン
      windowHeight = (window.innerHeight || _doc.documentElement.clientHeight || 0);//ウインドウの高さ

  // ウインドウの高さ以上スクロールさせると表示、以下なら非表示
  $(window).scroll(_.throttle(function(){//scrollイベントは500ミリ秒ごとに発火(lodash(Underscore.js)依存)
    if ($(window).scrollTop() > windowHeight){
      topBtn.fadeIn();//topBtn.css('display', 'inline-block');
    }
    else {
      topBtn.fadeOut();
    }
  }, 500));
});


/**
 * 外部リンクに target="_blank" を追加
 *
 * functions.php で URLを相対パスで出力するのが前提。でないと全てに付く
 * @url http://www.webcreatorbox.com/tech/jquery-tips20/
 */
//$(function () {
//  $("a[href^='http://']").attr('target','_blank');
//});


/**
 * 画像が読み込めない時、代替え画像を表示
 *
 * 相対パスにしてから有効にする。でないと全てに付く
 * @url http://www.webcreatorbox.com/tech/jquery-tips20/
 */
// $(function () {
//   $('img').error(function(){
//     $(this).attr({src:'../wp-content/themes/car-smize/img/common/no-image.png', alt:'準備中'});
//   });
// });


/**
 * a要素を包括する要素をクリックでもリンクするように
 *
 * スマートフォンなどでクリックしやすい
 * 1つのa子要素を含む親要素に .clickable クラスを付加
 * ※ clickableクラスを付けた親要素内の a 要素は1つでなければならない
 * @url http://www.webcreatorbox.com/tech/jquery-tips20/
 */
$(function () {
  $('.clickable').on('click', function() {
  window.location = $(this).find('a').attr('href');
  return false;
  });
});


/**
 * サムネイルをクリック（タップ）でメイン画像切替え
 */
// $(function() {
//   $('.change-main-image').each(function(){
//     var wrapperArea = $(this);
//     var mainImgArea = wrapperArea.find('.change-main-image-main');
//     var mainImg     = mainImgArea.find('img');
//     var thumbnails  = wrapperArea.find('.change-main-image-thumbnails a');

//     //クリックで切り替え処理
//     thumbnails.click(function(e){
//       mainImg.height(mainImg.height());//メイン画像切替え時のちらつき防止
//       var href = $(this).attr('href');
//       var alt  = $(this).find('img').attr('alt');
//       mainImg.fadeOut(0, function(){
//         mainImg.attr({'src':href, 'alt':alt}).fadeIn('slow');
//       });
//       mainImgArea.find('span').text(alt);

//       //a要素のリンク挙動を無効に
//       e.preventDefault();
//     }).css('cursor','pointer');//iOSでclickイベントに対応するため付加
//   });
// });



/* ============================================================
   ============================================================


   クロスブラウザ対応


   ============================================================
   ============================================================ */

/**
 * placeholder属性のクロスブラウザ対応
 *
 * placeholder属性に対応していないIE9以下、Safari6以下等に対応
 * @param {String} str パラメーターの説明
 * @author http://terkel.jp/archives/2010/07/html5-placeholder-fix-with-jquery/
 */

// detect support for input attirbute
function supportsInputAttribute(attr) {
  var input = _doc.createElement('input');
  return attr in input;
}

$(function(){
  if (!supportsInputAttribute('placeholder')) {
    $('[placeholder]').each(function() {
      var $this = $(this),
        $form = $this.closest('form'),
        placeholderText = $this.attr('placeholder'),
        placeholderColor = 'GrayText',
        defaultColor = $this.css('color');
      $this.bind({
        focus: function() {
          if ($this.val() === placeholderText) {
            $this.val('').css('color', defaultColor);
          }
        },
        blur: function() {
          if ($this.val() === '') {
            $this.val(placeholderText).css('color', placeholderColor);
          } else if ($this.val() === placeholderText) {
            $this.css('color', placeholderColor);
          }
        }
      });
      $this.trigger('blur');
      $form.submit(function() {
        if ($this.val() === placeholderText) {
          $this.val('');
        }
      });
    });
  }
});



// /* ============================================================
//    ============================================================


//    メインメニュー (レスポンシブ)


//    ============================================================
//    ============================================================ */

//   // ブラウザ幅の判定は Modernizr.mq() を使用

// $(function() {
//   // $('#toggle-button-search').on('click', function () {
//   //   $('#search-container').toggleClass('hide');
//   // });

//   // 検索エリア外クリックでエリア非表示にし.hide付加 ★★うまく機能していない
//   // $(document).click(function(e) {
//   //  if (!$.contains($('#search-container')[0], e.target) && !$('#search-container').hasClass('hide')) {
//   //    $('#search-container').addClass('hide');
//   //  }
//   // });

//   /**
//    * 関数定義：メインメニューボタンでメニューパネル開閉のトグル (モバイル表示)
//    */
//   var toggleButtonNav = function () {

//     $('#nav').addClass('hide');
//     var clickEvent = Modernizr.touch ? 'touchend' : 'click';

//     //メニューボタンで開閉メニューをトグル
//     $('#toggle-button-nav').on(clickEvent, function () {
//       $('#nav').toggleClass('hide');
//       return false;
//     });

//     //開いたメニュー以外の場所をクリックで閉じる
//     $('.main-container').on(clickEvent, function () {
//       if (! $('#nav').hasClass('hide')) {
//         $('#nav').addClass('hide');
//       }
//     });
//   };

//   /**
//    * 関数定義：2階層目をドロップダウン表示 (デスクトップ表示)
//    */
//   var desktopMainMenu = function() {

//     //下層メニューの開閉
//     $('#nav>ul>li')
//       .mouseenter(function () {
//         var subMenu = $(this).children('.sub-menu');
//         if (subMenu.length) {
//           subMenu.toggleClass('sub-menu-on');//.css({ display:"block" })
//         }
//       })
//       .mouseleave(function () {
//         $(this).children('.sub-menu').toggleClass('sub-menu-on');
//       });

//     //親メニューに.has-child付加
//     $('#nav>ul>li:has(ul)').each(function () {
//       $(this).addClass('has-child');
//     });
//   };

//   /**
//    * モバイルとデスクトップで分岐処理
//    */
//   var menuEvent = function() {
//     if( Modernizr.mq('only screen and (max-width: 768px)') ) {
//       toggleButtonNav();
//     }
//     else {
//       desktopMainMenu();
//     }
//   };
//   menuEvent();

//   //リサイズ時に再実行 (lodash の debounce で処理を間引き)
//   //$(window).resize(_.debounce( menuEvent, 500 ));



//   /**
//   * 隠れるメニュー
//   */
//   if(Modernizr.csstransitions) {
//     var pageHeader = $('[role="banner"]'),
//       headerHeight = pageHeader.outerHeight();

//     var scroll = $(document).scrollTop();//スクロール上位置(上スクロールの判断用)

//     //scrollイベントは500ミリ秒ごとに発火(lodash(Underscore.js)依存)
//     $(window).scroll(_.throttle(function(){
//       var scrolled = $(document).scrollTop();//スクロール中のスクロール上位置

//       //ヘッダーの高さ以上スクロールした場合のみ非表示用のクラスを付加
//       if (scrolled > headerHeight){
//         pageHeader.addClass('hide-header');
//       }
//       else {
//         pageHeader.removeClass('hide-header');
//       }

//       //上スクロール時のみに表示するクラスを付加
//       if (scrolled < scroll){
//         pageHeader.addClass('show-header');
//       }
//       else {
//         pageHeader.removeClass('show-header');
//       }

//       //スクロール上位置の更新
//       scroll = $(document).scrollTop();
//     }, 500));
//   }

// });



/* ============================================================
   ============================================================


   フォーム


   ============================================================
   ============================================================ */

/**
 * フォーカスしているフォームのラベルにクラス付加、フォーカスが外れるとクラス外す
 *
 * ユーザビリティを上げるためのスタイリング用
 */
//$(function (){
//  $('form :input').focus(function() {
//    $('label[for="' + this.id + '"]').addClass('labelfocus');
//  });
//  $('form :input').blur(function() {
//    $('label[for="' + this.id + '"]').removeClass('labelfocus');
//  });
//});


/**
 * フォームにテキストを入れておき、フォーカスで消す
 *
 * ★★サンプル。適宜作成。クラス化
 */
//$(function(){
//  $('.focus').focus(function(){
//    if(this.value === 'キーワードを入力'){
//      $(this).val('').css('color', '#000');
//    }
//  });
//  $('.focus').blur(function(){
//    if(this.value === ''){
//      $(this).val('キーワードを入力').css('color', '#999');
//    }
//  });
//});


/**
 * テキストエリアの入力文字数をカウント。最大値以上なら赤字に
 *
 * ★★サンプル。適宜作成。クラス化
 */
//$(function(){
//  $('textarea').keyup(function(){
//    var counter = $(this).val().length;
//    $('#countUp').text(counter);
//    if(counter === 0){
//      $("#countUp").text('0');
//    }
//    if(counter >= 10){
//      $('#countUp').css('color', 'red');
//    }
//    else {
//      $('#countUp').css('color', '#333');
//    }
//  });
//});



/* ============================================================
   ============================================================


   モーダルウインドウ


   ============================================================
   ============================================================ */

// /**
//  * 中央センター表示
//  *
//  * モーダルウインドウなどで使用。IE6も対応
//  * Usage : fixCenterMiddle('#foo', #body');
//  * @param1 {String} str 中央表示させたい要素
//  * @param2 {String} str 基準となる要素
//  */
// var fixCenterMiddle = function(elm, wrapTarget) {
//   if (!(elm instanceof jQuery)) { elm = $(elm); }
//   var windowHeight = window.innerHeight ? window.innerHeight : $(window).height();
//   var top  = Math.floor((windowHeight - elm.outerHeight()) / 2);
//   //alert($(window).height() + ', ' + elm.outerHeight());//★iPhoneで、356-332=24pxになる。タテは480pxのはず
//   var left = Math.floor(($(window).width() - elm.outerWidth()) / 2);
//   elm.css({ 'top':top, 'left':left });
//   //IE6で position:fixd 相当の処理
//   if (typeof window.addEventListener === "undefined" && typeof _doc._docElement.style.maxHeight === "undefined") {
//     $(wrapTarget).wrapAll('<div id="cover" />');//bodyタグ内側の固定する要素以外全てを包む要素。該当する要素を指定。IE6 で position:fixed 相当の処理をさせるために必要
//     $('html, html body').css({
//       'height': '100%',
//       'overflow-y': 'hidden',
//       'overflow-x': 'auto'
//     });
//     $('html #cover').css({
//       'overflow': 'auto',
//       'position': 'relative',
//       'width': '100%',
//       'height': '100%'
//     });
//     elm.css({ 'position': 'absolute' });
//   }
// };


// /**
//  * モーダルウインドウ A (一般用、jQuery非使用)
//  *
//  * 参考：http://www.queness.com/post/77/simple-jquery-modal-window-tutorial
//  * functions.js、style.cssへの記述と併用
//  * 上記の中央センター表示させる fixCenterMiddle() 関数に基準となる要素をセット
//  * ドットシンタックスで最適化、変数にプレフィックス付けた。マスクがずれる不具合を解消した。EnterでなくESCキーでウインドウ閉じるようにした
//  * モダンブラウザ、iPhone、IE8 で確認済 ★★IE6はうまく機能しない→修正
//  */
// $(function() {

//   $('a[name=modal]').click(function(e) {
//     var id = $(this).attr('href');//Get the A tag
//     var elm = $(id);//該当idの要素をjQueryオブジェクトに

//     //全体の高さとウインドウ幅を取得(1)
//     var maskWidth = $(window).width();
//     var maskHeight = $(_doc).height();

//     //(1)を覆う#maskの設定、表示
//     $('#modal_window_mask')
//       .css({ 'width':maskWidth, 'height':maskHeight })
//       .fadeIn(500)
//       .fadeTo('slow', 0.5);

//     //中央表示
//     fixCenterMiddle(elm, '.main-container');//ここに基準となる外側の要素をセット

//     //モーダルウインドウをセンター表示
//     elm.fadeIn(500);
//     if (e.target) { e.preventDefault(); } else { return false; }
//   });

//   //閉じるボタン
//   $('.modal_window_window .modal_window_close').click(function (e) {
//     $('#modal_window_mask, .modal_window_window').hide();
//     if (e.target) { e.preventDefault(); } else { return false; }
//   });

//   //モーダルウインドウ表示中、背景（#mask）をクリックで閉じる
//   $('#modal_window_mask').click(function () {
//     $(this).hide();
//     $('.modal_window_window').hide();
//   });

//   //ウインドウリサイズ時に再計算
//   $(window).resize(function () {
//     var box = $('#modal_window_boxes .modal_window_window');

//     var maskHeight = $(_doc).height();
//     var maskWidth = $(window).width();
//     var elmPadding = parseInt(box.css('padding'), 10);

//     $('#modal_window_mask').css({'width':maskWidth, 'height':maskHeight});

//     //中央になる場合のx,y座標（ウインドウの高さと幅 - 要素自身の幅の半分）
//     var topPoint = Math.floor(($(window).height() - box.height()) / 2 - elmPadding);
//     var leftPoint = Math.floor(($(window).width() - box.width()) / 2 - elmPadding);

//     //モーダルウインドウをセンター表示
//     box.css({ 'top':topPoint, 'left':leftPoint });
//   });

//   //キー入力でモーダルウインドウ閉じる
//   $(_doc).keyup(function(e) {
//     if(e.keyCode === 27) {//13はESCキー（キー一覧：http://www.accessclub.jp/samplefile/help/help_154_1.htm）
//       $('#modal_window_mask, .modal_window_window').hide();
//     }
//   });

//   //URLアクセス時に実行させたい場合
//   //★★モーダルウインドウの要素に特定のIDが付いていたら実行させるようにしたい
//   //function launchWindow(id) {
//   //  var maskHeight = $(_doc).height();
//   //  var maskWidth = $(window).width();
//   //
//   //  $('#modal_window_mask')
//   //    .css({'width':maskWidth,'height':maskHeight})
//   //    .fadeIn(1000)
//   //    .fadeTo("slow",0.8);
//   //
//   //  var winH = $(window).height();
//   //  var winW = $(window).width();
//   //
//   //  $(id)
//   //    .css('top',  winH/2-$(id).height())
//   //    .css('left', winW/2-$(id).width()/2)
//   //    .fadeIn(2000);
//   //}
//   ////実行
//   //launchWindow('#modal_window_dialog2');//idは表示したいモーダルウインドウのID

//   //他、Cookieを使って設定保存したりもできる
// });


/**
 * モーダルウインドウ B (メニュー用、jQuery非使用)
 *
 * A とほぼ同じ。違いを要検証
 */

// #menu_button
// #menu_modal_window_boxes
// #menu_modal_window_mask
// #menu_modal_window_dialog
// #menu_modal_window_window
// #menu_modal_window_close

//$(function() {
//
//  $('#menu_modal_window_button').click(function(e) {
//
//    var elm = $('#menu_modal_window_dialog');
//
//    //全体の高さとウインドウ幅を取得(1)
//    var maskHeight = $(_doc).height();
//    var maskWidth = $(window).width();
//
//    //(1)を覆う#maskの設定、表示
//    $('#menu_modal_window_mask')
//      .css({ 'width':maskWidth, 'height':maskHeight })
//      .fadeIn(1000)
//      .fadeTo('slow', 0.8);
//
//    //中央表示
//    fixCenterMiddle(elm, '#container');
//
//    //モーダルウインドウをセンター表示
//    elm.fadeIn(2000);
//    if (e.target) { e.preventDefault(); } else { return false; }
//
//    //★★iScroll（options: http://cubiq.org/iscroll-4）Androidのみ
//    var agent = navigator.userAgent;
//    if(agent.search(/Android/) !== -1 && typeof(iScroll) !== "undefined") {
//      $.each(
//        elm,function(){//$('#menu_modal_window_dialog')
//          new iScroll(this,{
//            bounce: false,
//            fixedScrollbar: true,
//            lockDirection: true
//            //,onBeforeScrollStart: function(){}
//          });
//        }
//      );
//    }
//
//  });
//
//  //閉じるボタン
//  $('#menu_modal_window_close').click(function (e) {
//    $('#menu_modal_window_mask, #menu_modal_window_dialog').hide();
//    if (e.target) { e.preventDefault(); } else { return false; }
//  });
//
//  //モーダルウインドウ表示中、背景（#mask）をクリックで閉じる
//  $('#menu_modal_window_mask').click(function () {
//    $(this).hide();
//    $('#menu_modal_window_dialog').hide();
//  });
//
//  //ウインドウリサイズ時に再計算
//  $(window).resize(function () {
//    var box = $('#menu_modal_window_dialog');
//
//    var maskHeight = $(_doc).height();
//    var maskWidth = $(window).width();
//    var elmPadding = parseInt(box.css('padding'), 10);
//
//    $('#menu_modal_window_mask').css({'width':maskWidth, 'height':maskHeight});
//
//    //中央になる場合のx,y座標（ウインドウの高さと幅 - 要素自身の幅の半分）
//    var topPoint = Math.floor(($(window).height() - box.height()) / 2 - elmPadding);
//    var leftPoint = Math.floor(($(window).width() - box.width()) / 2 - elmPadding);
//
//    //モーダルウインドウをセンター表示
//    box.css({ 'top':topPoint, 'left':leftPoint });
//  });
//
//  //キー入力でモーダルウインドウ閉じる
//  $(_doc).keyup(function(e) {
//    if(e.keyCode === 27) {//13はESCキー（キー一覧：http://www.accessclub.jp/samplefile/help/help_154_1.htm）
//      $('#menu_modal_window_dialog').hide();
//    }
//  });
//
//});


/* ============================================================
   ============================================================


   ソーシャル関連 (Tumblr, Facebook, Twitter, Google Analytics)


   ============================================================
   ============================================================ */

/**
 * Tumblrボタン
 *
 * @link http://platform.tumblr.com/v1/share.js
 * ページ内の印刷ボタン（.printer）が押された時だけprint.cssを適応する
 * 別途 print.css で印刷時の CSS を設定し、セットで使う
 * 参照元：http://snippet-editor.com/2010/08/2way-print-css.html
 */

//投稿時リンク、引用、画像、動画のいずれかを指定することも可能（JavaScript追加記述必要）

//$(function(){eval(function(p,a,c,k,e,d){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--){d[e(c)]=k[c]||e(c)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('6 8=C.8||{};(7(){8.G=7(A){6 c=A.g.m(/(D.)?r(\\.B)?(\\:\\d{2,4})?\\/y(.+)?/i);c=(c[4]!==15&&c[4].O>1);6 d=h,w=C,e=w.N,k=d.N,x=d.16,s=(e?e():(k)?k():(x?x.14().13:0)),f=\'Z://D.r.B/y\',l=d.11,e=12,p=\'?v=3&u=\'+e(l.g)+\'&t=\'+e(d.17)+\'&s=\'+e(s),u=f+p;5(c){u=A.g}M{5(!/^(.*\\.)?r[^.]*$/.9(l.18))1d(0);1e()}R(z){a=7(){5(!w.1c(u,\'t\',\'1b=0,Y=0,1a=1,1f=S,T=X\'))l.g=u};5(/U/.9(F.K))J(a,0);n a()}W(0)};8.I=7(){6 b=h.V(\'a\'),L=b.O,m=o,j;19(6 i=0;i<L;i++){m=b[i].g.m(/(D.)?r(\\.B)?(\\:\\d{2,4})?\\/y(.+)?/i);5(m){j=b[i].H;b[i].H=7(e){8.G(1v);5(j)j();j=o;e.1t()}}}};(7(i){6 u=F.K;6 e=o;6 q=J;5(/1w/i.9(u)){q(7(){6 E=h.1u;5(E=="1r"||E=="1k"){i()}n{q(Q.P,10)}},10)}n 5((/1j/i.9(u)&&!/(1s)/.9(u))||(/1h/i.9(u))){h.1l("1m",i,o)}n 5(e){(7(){6 t=h.1p(\'1o:1n\');M{t.1i(\'1q\');i();t=1x}R(e){q(Q.P,0)}})()}n{C.1g=i}})(8.I)}());',62,96,'|||||if|var|function|Tumblr|test||anchors|advanced||||href|_doc||old_onclick|||match|else|false||st|tumblr|||||||share||anchor|com|window|www|dr|navigator|share_on_tumblr|onclick|activate_share_on_tumblr_buttons|setTimeout|userAgent|anchors_length|try|getSelection|length|callee|arguments|catch|450|height|Firefox|getElementsByTagName|void|430|resizable|http||location|encodeURIComponent|text|createRange|undefined|selection|title|host|for|status|toolbar|open|throw|tstbklt|width|onload|opera|doScroll|mozilla|complete|addEventListener|DOMContentLoaded|rdy|doc|createElement|left|loaded|compati|preventDefault|readyState|this|webkit|null'.split('|'),0,{}))});

//ボタン表示部分に以下をペースト（本家サンプルを改良。CSSを分離してクラス付加）
//<a href="http://www.tumblr.com/share" title="Share on Tumblr" class="tumblr-button">Share on Tumblr</a>
//CSSに以下を追加
//.tumblr-button {
//  display: inline-block;
//  text-indent: -9999px;
//  overflow: hidden;
//  width: 81px;
//  height: 20px;
//  background: url('http://platform.tumblr.com/v1/share_1.png') top left no-repeat transparent;
//}


/**
 * Google Analytics Facebookボタン計測
 *
 * ★★エラー多いのでドキュメント見て修正
 */

//// like
//FB.Event.subscribe('edge.create', function(targetUrl) {
//  _gaq.push(['_trackSocial', 'facebook', 'like', targetUrl]);
//});
//// unlike
//FB.Event.subscribe('edge.remove', function(targetUrl) {
//  _gaq.push(['_trackSocial', 'facebook', 'unlike', targetUrl]);
//});
//// send
//FB.Event.subscribe('message.send', function(targetUrl) {
//  _gaq.push(['_trackSocial', 'facebook', 'send', targetUrl]);
//});


/**
 * Google Analytics Tweetボタン計測
 *
 * ★★エラー多いのでドキュメント見て修正
 */

//function extractParamFromUri(uri, paramName) {
//  if (!uri) {
//  return;
//  }
//  var uri = uri.split('#')[0];  // Remove anchor.
//  var parts = uri.split('?');  // Check for query params.
//  if (parts.length == 1) {
//  return;
//  }
//  var query = decodeURI(parts[1]);
//
//  // Find url param.
//  paramName += '=';
//  var params = query.split('&');
//  for (var i = 0, param; param = params[i]; ++i) {
//  if (param.indexOf(paramName) === 0) {
//    return unescape(param.split('=')[1]);
//  }
//  }
//}
//twttr.events.bind('tweet', function(event) {
//  if (event) {
//  var targetUrl;
//  if (event.target && event.target.nodeName === 'IFRAME') {
//  targetUrl = extractParamFromUri(event.target.src, 'url');
//  }
//  _gaq.push(['_trackSocial', 'twitter', 'tweet', targetUrl]);
//  }
//});



/* ============================================================
   ============================================================


   その他


   ============================================================
   ============================================================ */

/**
 * メニュー表示/非表示 #sidebar をモバイル幅時のみ表示
 */
//$(function(){
//  var menuDisp = 0;
//
//  $('#menu_button').click(function(){
//    if(menuDisp === 0){
//      $('#sidebar').show('fast');
//      menuDisp = 1;
//    }
//    else {
//      $('#sidebar').hide('fast');
//      menuDisp = 0;
//    }
//  });
//
//});


/**
 * Topページの画像スライドショー
 *
 * 参考：http://snook.ca/archives/javascript/simplest-jquery-slideshow
 */
//$(function(){
//  //設定
//  var switchDelay = 6000;//表示時間（ミリ秒 = 1/1000秒） 7000くらいがいいか？
//  var fadeSpeed = 3000;//切り替え速度（ミリ秒）
//  var imgArea = $('#change_img-area');//切り替え画像を包む要素
//  var images = imgArea.children('img');//切り替える画像を要素セットに（配列。これもjQueryオブジェクト）
//
//  //中央センター表示させるためのマージンを計算し設定
//  images
//    .each(function(){
//      $(this).css({
//        //'top' : Math.floor((imgArea.height() - $(this).outerHeight()) / 2),//タテを包括要素の上辺に揃えたければこの行をコメントアウト
//        'top' : '35px',
//        'left': Math.floor((imgArea.width()  - $(this).outerWidth())  / 2)
//      });
//    });
//
//    //最初の画像を表示（中央センター揃えの後に描かないと、初め0,0に表示されてしまう）
//    imgArea.find('img:first-child').css('display','block');
//
//    //ie対策 パッと変わるのを直すコード（試す）
//    //$(".hogehoge").css("position", "static").fadeIn("normal", function(){
//    //  $(".hogehoge").css("position", "relative");
//    //});
//
//  //実行
//  setInterval(//一定時間ごとに実行
//    function(){
//      imgArea
//        .find('img:first-child')//１番目の画像を
//        .fadeOut(fadeSpeed)//フェードアウト（1番目の画像はDOMから消える）
//        .next()//現在位置を次の兄弟要素へ移動
//        .fadeIn(fadeSpeed)//フェードイン
//        .end()//現在位置を元（DOMから消えた1番目の画像）へ戻して・・・
//        .appendTo(imgArea);//imgAreaの最後（最後の画像の後）に付け足す → ループ
//    }, switchDelay
//  );
//});


/**
 * 印刷用 print.js
 *
 * ページ内の印刷ボタン（.printer）が押された時だけprint.cssを適応する
 * 別途 print.css で印刷時の CSS を設定し、セットで使う
 * 参照元：http://snippet-editor.com/2010/08/2way-print-css.html
 */
//$(function(){
//  $('.printer').click(function(){//.printer(印刷ボタン)が押されたら
//    $('body').addClass('print');//body classに"print"を追加
//    window.print();//印刷を実行
//    //var timeout = setTimeout(function(){
//    setTimeout(function(){
//      $('body').removeClass('print');//1秒後に bodyタグの class "print" を削除
//    }, 1000);
//    return false;
//  });
//});
