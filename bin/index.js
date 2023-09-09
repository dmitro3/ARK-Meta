/**
 * 设置LayaNative屏幕方向，可设置以下值
 * landscape           横屏
 * portrait            竖屏
 * sensor_landscape    横屏(双方向)
 * sensor_portrait     竖屏(双方向)
 */
window.screenOrientation = "sensor_landscape";

//-----libs-begin-----
loadLib("libs/laya.core.js")
loadLib("libs/laya.ui.js")
loadLib("libs/laya.d3.js")
loadLib("libs/domparserinone.js")
loadLib("libs/laya.physics3D.js")
//-----libs-end-------
loadLib("libs/wallet.js")
loadLib("libs/astar.js")
loadLib("libs/laya-zip.js")
loadLib("libs/clipper.js")
loadLib("libs/poly2tri.js")
loadLib("js/bundle.js");
