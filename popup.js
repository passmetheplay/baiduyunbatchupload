// document.getElementById('uploadButton').addEventListener('click', function() {
//     var fileInput = document.getElementById('fileInput');
//     var file = fileInput.files[0];
//     if (file) {
//         console.log('File chosen:', file.name);
//         // 读取文件内容
//         var reader = new FileReader();
//         reader.onload = function(e) {
//             var fileData = e.target.result;
//             // 发送文件数据
//             chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//                 chrome.tabs.sendMessage(tabs[0].id, { fileData, fileName: file.name, fileType: file.type });
//             });
//         };
//         reader.readAsArrayBuffer(file);
//     } else {
//         console.log('No file chosen.');
//     }
// });

document.getElementById('showUploadToolbarButton').addEventListener('click', function() {
    console.log('showUploadToolbarButton clicked');

    // 查找百度云disk/main的tab
    chrome.tabs.query({}, function(tabs) {
        var baiduYunTab = tabs.find(tab => tab.url && tab.url.startsWith("https://yun.baidu.com/disk/main"));
        if (baiduYunTab) {
            // 如果找到了百度云的tab，激活它
            chrome.tabs.update(baiduYunTab.id, {active: true}, function() {
                // 然后发送消息以显示上传工具栏
                console.log('发送消息以显示上传工具栏')
                chrome.tabs.sendMessage(baiduYunTab.id, { action: "showUploadToolbar" });
            });
        } else {
            console.log('未找到百度云disk/main的tab');
            // 在这里给用户一个提示
            alert('未找到百度云我的文件页面，请在浏览器里打开百度云-我的文件-具体上传目录');
        }
    });
});


