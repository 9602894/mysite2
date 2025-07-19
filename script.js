async function uploadFile() {
    const filename = document.getElementById('filename').value;
    const password = document.getElementById('password').value;
    const content = document.getElementById('content').value;

    if (!filename || !password || !content) {
        alert('请填写所有必填字段');
        return;
    }

    const response = await fetch('/api/upload', {
        method: 'POST',
        body: JSON.stringify({ filename, password, content }),
        headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();
    if (data.success) {
        document.getElementById('linkAnchor').href = data.fileLink;
        document.getElementById('linkAnchor').textContent = data.fileLink;
        document.getElementById('linkDisplay').style.display = 'block';
    } else {
        alert('上传失败: ' + data.error);
    }
}

function copyLink() {
    const link = document.getElementById('linkAnchor').href;
    navigator.clipboard.writeText(link)
        .then(() => alert('链接已复制到剪贴板'))
        .catch(err => alert('复制失败: ' + err));
}
