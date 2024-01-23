var uploadButton; // 全局变量：上传文件按钮
var uploadFolderButton; // 全局变量：上传文件夹按钮
var uploadedFilesCount; // 全局变量：已上传文件数
var totalFiles; // 全局变量：总文件数
var currentFiles; // 当前选择的文件列表
var uploadWarningText; // 全局变量：上传警告文本
var uploadAnimation; // 全局变量：上传动图


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log('Received message from popup.js:', message);
    // 新增处理逻辑
    if (message.action === "showUploadToolbar") {
        showUploadToolbar();
    }
    // if (message.fileData) {
    //     console.log('Creating file from received data...');
    //     var fileBlob = new Blob([message.fileData], { type: message.fileType });
    //     var file = new File([fileBlob], message.fileName, { type: message.fileType });
    //     console.log('File created:', file);
    //     simulateFileSelectionAndUpload([file]);
    // }

});

function showUploadToolbar() {
    var uploadDiv = document.getElementById('uploadDivId'); // 假设您的上传工具栏div有一个ID
    if (uploadDiv) {
        console.log('Upload toolbar already exists.');
        // uploadDiv.style.display = 'block'; // 显示工具栏
        uploadDiv.scrollIntoView(); // 滚动到工具栏位置
    }else
    {
        console.log('Upload toolbar does not exist. Creating it...');
        createAndInsertUploadButton();
    }
}


function createAndInsertUploadButton() {
    console.log('plugin start createAndInsertUploadButton');
    var uploadDiv = document.createElement('div');
    uploadDiv.id = 'uploadDivId'; // 设置上传工具栏div的ID
    uploadDiv.style.padding = '5px';
    uploadDiv.style.backgroundColor = '#E8F4FC';
    uploadDiv.style.color = '#333';
    uploadDiv.style.borderBottom = '2px solid #B0DAF1';
    uploadDiv.style.textAlign = 'center';
    uploadDiv.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    uploadDiv.style.top = '0';
    uploadDiv.style.width = '100%';
    uploadDiv.style.zIndex = '1000';
    uploadDiv.style.alignItems = 'center'; // 垂直居中对齐子元素
    uploadDiv.style.justifyContent = 'center'; // 水平居中对齐子元素
    uploadDiv.style.display = 'flex';
    uploadDiv.style.flexWrap = 'nowrap';


    uploadButton = createButton('上传文件', 'fa-upload', '#4A90E2', '#397ab9'); // 蓝色按钮，深蓝色悬停效果
    var hiddenFileInput = createHiddenInput(false);
    uploadButton.addEventListener('click', function() {
        if (isValidBaiduYunDirectory(window.location.href)) {
            hiddenFileInput.click();
            updateCurrentDirectory();
            batchProgressText.style.display = 'none';
            totalProgressText.style.display = 'none';
        } else {
            alert('请确保您处于有效的百度云上传目录下，请确保您在百度网盘-我的文件-具体上传目录下');
        }
    });

    uploadFolderButton = createButton('上传文件夹', 'fa-folder', '#4A90E2', '#397ab9'); // 同上
    var hiddenFolderInput = createHiddenInput(true);
    uploadFolderButton.addEventListener('click', function() {
        if (isValidBaiduYunDirectory(window.location.href)) {
            hiddenFolderInput.click();
            updateCurrentDirectory();
            batchProgressText.style.display = 'none';
            totalProgressText.style.display = 'none';
        } else {
            alert('请确保您处于有效的百度云上传目录下，请确保您在百度网盘-我的文件-具体上传目录下');
        }
    });

    var fileInfoText = createInfoText('fileInfo', '选择的文件数: 0');
    var batchProgressText = createInfoText('batchProgress', '当前批次进度: 0%');
    batchProgressText.style.display = 'none';
    var totalProgressText = createInfoText('totalProgress', '总进度: 0%');
    totalProgressText.style.display = 'none';
    var uploadDirectory = createInfoText('uploadDirectory', '上传目录: ' + getCurrentDirectory());
    uploadDirectory.style.color = '#FF5733';

    var startUploadButton = createActionButton('开始上传', '#28a745', '#218838', '#fff','5px'); // 绿色按钮，深绿色悬停效果
    startUploadButton.style.display = 'none';
    startUploadButton.addEventListener('click', function() {
        startUploadButton.style.display = 'none';
        cancelUploadButton.style.display = 'none';
        batchProgressText.style.display = 'block';
        totalProgressText.style.display = 'block';
        uploadWarningText.style.display = 'block'; // 显示提醒文本
        uploadAnimation.style.display = 'block'; // 显示动图
        handleFileBatchUpload(currentFiles, fileInfoText, batchProgressText, totalProgressText);
    });

    var cancelUploadButton = createActionButton('放弃上传', '#dc3545', '#c82333', '#fff','5px'); // 红色按钮，深红色悬停效果
    cancelUploadButton.style.display = 'none';
    cancelUploadButton.addEventListener('click', function() {
        // 清空已选文件、更新选择文件数、展示两个上传按钮，并使其恢复可用状态
        currentFiles = null;
        fileInfoText.textContent = '选择的文件数: 0';
        setButtonDisabledState(uploadButton, false);
        setButtonDisabledState(uploadFolderButton, false);
        startUploadButton.style.display = 'none';
        cancelUploadButton.style.display = 'none';

    });

    uploadWarningText = createInfoText('uploadWarning', '上传过程中请不要关闭该页面');
    uploadWarningText.style.display = 'none'; // 初始时隐藏

    uploadAnimation = document.createElement('img');
    uploadAnimation.style.width = '35px'; // 设置宽度，例如100px
    uploadAnimation.style.height = '35px'; // 设置高度，例如100px
    uploadAnimation.src = 'https://files.catbox.moe/sfu2sh.gif'; // 替换为动图的URL
    uploadAnimation.style.display = 'none'; // 初始时隐藏



    uploadDiv.appendChild(uploadButton);
    uploadDiv.appendChild(hiddenFileInput);
    uploadDiv.appendChild(uploadFolderButton);
    uploadDiv.appendChild(hiddenFolderInput);
    uploadDiv.appendChild(fileInfoText);
    uploadDiv.appendChild(batchProgressText);
    uploadDiv.appendChild(totalProgressText);
    uploadDiv.appendChild(uploadDirectory);
    uploadDiv.appendChild(startUploadButton);
    uploadDiv.appendChild(cancelUploadButton);
    uploadDiv.appendChild(uploadWarningText);
    uploadDiv.appendChild(uploadAnimation);

    var targetElement = document.querySelector('body > div.nd-main-layout.aichat-width.show-out-sug');
    if (targetElement && targetElement.parentNode) {
        targetElement.parentNode.insertBefore(uploadDiv, targetElement);
    }

    hiddenFileInput.addEventListener('change', function() {
        currentFiles = this.files;
        fileInfoText.textContent = '选择的文件数: ' + currentFiles.length;
        // 禁用“上传文件”和“上传文件夹”按钮
        setButtonDisabledState(uploadButton, true);
        setButtonDisabledState(uploadFolderButton, true);
        startUploadButton.style.display = 'block';
        cancelUploadButton.style.display = 'block';
    });

    hiddenFolderInput.addEventListener('change', function() {
        currentFiles = this.files;
        fileInfoText.textContent = '选择的文件数: ' + currentFiles.length;
        // 禁用“上传文件”和“上传文件夹”按钮
        setButtonDisabledState(uploadButton, true);
        setButtonDisabledState(uploadFolderButton, true);
        startUploadButton.style.display = 'block';
        cancelUploadButton.style.display = 'block';
    });
}

function createButton(text, iconClass, color, hoverColor) {
    var button = document.createElement('button');
    button.textContent = ' ' + text;
    button.style.padding = '5px 8px';
    button.style.backgroundColor = '#FFF';
    button.style.color = color;
    button.style.border = '1px solid #B0DAF1';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.marginRight = '10px';
    button.style.transition = 'color 0.3s';

    var icon = document.createElement('i');
    icon.className = 'fa ' + iconClass;
    icon.style.marginRight = '5px';
    button.insertBefore(icon, button.firstChild);

    // 悬停效果
    button.onmouseover = function() {
        button.style.color = hoverColor;
    };
    button.onmouseout = function() {
        button.style.color = color;
    };

    return button;
}

function createHiddenInput(isFolder) {
    var input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.style.display = 'none';
    if (isFolder) {
        input.webkitdirectory = true;
    }
    return input;
}

function createInfoText(id, text) {
    var span = document.createElement('span');
    span.id = id;
    span.textContent = text;
    span.style.marginLeft = '20px';
    span.style.fontWeight = 'bold';
    return span;
}

function createActionButton(text, bgColor, hoverColor, textColor,marginLeft) {
    var button = document.createElement('button');
    button.textContent = text;
    button.style.padding = '5px 8px';
    button.style.backgroundColor = bgColor;
    button.style.color = textColor;
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.marginRight = '10px';
    button.style.fontWeight = 'bold';
    button.style.marginLeft = marginLeft; // 设置左边距
    button.style.transition = 'background-color 0.3s';

    // 悬停效果
    button.onmouseover = function() {
        button.style.backgroundColor = hoverColor;
    };
    button.onmouseout = function() {
        button.style.backgroundColor = bgColor;
    };

    return button;
}

function handleFileBatchUpload(files, fileInfoText, batchProgressText, totalProgressText) {
    uploadedFilesCount = 0;
    totalFiles = files.length;
    var batchSize = 5;
    var totalBatches = Math.ceil(totalFiles / batchSize);

    if (totalFiles > 0) {
        setButtonDisabledState(uploadButton, true);
        setButtonDisabledState(uploadFolderButton, true);
    }

    let batch = 0;

    function processNextBatch() {
        if (batch < totalBatches) {
            let start = batch * batchSize;
            let end = start + batchSize;
            let batchFiles = Array.from(files).slice(start, end);
            simulateFileSelectionAndUpload(batchFiles, batchProgressText, totalProgressText, batch + 1, totalBatches);
            batch++;
            checkUploadCompletion(processNextBatch);
        }
    }

    processNextBatch();
}



function checkUploadCompletion(callback) {
    let timeout = 60000; // 超时时间，例如60秒
    let startTime = Date.now();

    let interval = setInterval(function() {
        let redDot = document.querySelector('#upload-transfer_list > i.red-dot');
        let currentTime = Date.now();

        // 检查是否所有上传任务都已完成或是否超时
        if ((redDot && redDot.style.display === 'none') || currentTime - startTime > timeout) {
            clearInterval(interval);
            callback(); // 执行下一批上传
        }
    }, 1000); // 每秒检查一次
}

function simulateFileSelectionAndUpload(files, batchProgressText, totalProgressText, currentBatch, totalBatches) {
    var progress = 0;
    var interval = setInterval(function() {
        if (progress >= 100) {
            clearInterval(interval);
            uploadedFilesCount += files.length;
            var overallProgress = Math.round((uploadedFilesCount / totalFiles) * 100);
            totalProgressText.textContent = `总进度: ${overallProgress}% (${uploadedFilesCount}/${totalFiles} 文件)`;
            batchProgressText.textContent = `当前批次 ${currentBatch}/${totalBatches} 完成`;

            if (uploadedFilesCount >= totalFiles) {
                setButtonDisabledState(uploadButton, false);
                setButtonDisabledState(uploadFolderButton, false);
                uploadAnimation.style.display = 'none'; // 隐藏上传动画
                uploadWarningText.style.display = 'none'; // 隐藏上传警告文本
            }
        } else {
            progress += 20;
            batchProgressText.textContent = `当前批次 ${currentBatch}/${totalBatches} 进度: ${progress}%`;
        }
    }, 1000);

    var dataTransfer = new DataTransfer();
    for (var i = 0; i < files.length; i++) {
        dataTransfer.items.add(files[i]);
    }

    var fileInput = document.querySelector('.nd-upload-button > .nd-h5-form > .input');
    if (fileInput) {
        fileInput.files = dataTransfer.files;
        var changeEvent = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(changeEvent);
    } else {
        console.log('File input element not found');
    }
}

function setButtonDisabledState(button, disabled) {
    button.disabled = disabled;
    if (disabled) {
        button.style.backgroundColor = '#ccc';
        button.style.color = '#666';
        button.style.borderColor = '#aaa';
    } else {
        button.style.backgroundColor = '#FFF';
        button.style.color = '#4A90E2';
        button.style.borderColor = '#B0DAF1';
    }
}

function getCurrentDirectory() {
    var url = new URL(window.location.href);
    var hash = url.hash;
    var hashParts = hash.split('?');
    if (hashParts.length > 1) {
        var queryParams = new URLSearchParams(hashParts[1]);
        var pathParam = queryParams.get('path');
        console.log('Path parameter:', pathParam);
        return pathParam ? decodeURIComponent(pathParam) : null;
    } else {
        console.log('No query parameters in URL hash.');
        return null;
    }
}

function updateCurrentDirectory() {
    var uploadDirectory = document.getElementById('uploadDirectory');
    var currentDir = getCurrentDirectory();
    if (currentDir ) {
        uploadDirectory.textContent = '上传目录: ' + currentDir;
    }
}

function getCurrentDirectory() {
    var url = new URL(window.location.href);
    var hash = url.hash;
    var hashParts = hash.split('?');
    if (hashParts.length > 1) {
        var queryParams = new URLSearchParams(hashParts[1]);
        var pathParam = queryParams.get('path');
        return pathParam ? decodeURIComponent(pathParam) : null;
    } else {
        return null;
    }
}

function isValidBaiduYunDirectory(url) {
    return url.includes('https://yun.baidu.com/disk/main') && url.includes('category=all') ;
}


createAndInsertUploadButton();