// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

/* - - - - - - - プラグイン - - - - - - - - - - - -
短いものは直接、長いものは'vendor'ディレクトリに設置、順番通りに実行、使えるものはCDN使うこと

[index]

1) プラグイン名1
   説明がここに入る

2) プラグイン名2
   説明がここに入る

3) プラグイン名3
   説明がここに入る
*/

/* - - - - - - - - - - - - - - - - - - - - - - */
/*! 1) プラグイン名1 */
/*
http://hogehoge1/
@author プラグイン作者名
v. バージョン番号

ライセンス表示
*/

//短いプラグインなら直接コピペ
//(function($){
//  //Code here
//})(window.jQuery);

$(function(){
  //処理を記述
});

/* - - - - - - - - - - - - - - - - - - - - - - */
/*! 2) プラグイン名2 */
/*
http://hogehoge2/
@author プラグイン作者名
v. バージョン番号

ライセンス表示
*/
$(function(){
  //処理を記述
});
