window._flutter.buildConfig={engineRevision:'5d531788691ec3404cac0cee66ead4007b177363',builds:[{compileTarget:'dart2js',renderer:'canvaskit',mainJsPath:'main.dart.js'}]};
window._flutter.loader.load({config:{canvasKitBaseUrl:'canvaskit/',canvasKitVariant:'full'},onEntrypointLoaded:async initializer=>{
 const app=await initializer.initializeEngine({canvasKitBaseUrl:'canvaskit/',canvasKitVariant:'full'});
 await app.runApp();
}});
