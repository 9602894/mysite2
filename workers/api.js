export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 上传文件和保存元数据
    if (request.method === 'POST' && url.pathname === '/api/upload') {
      const { filename, password, content } = await request.json();

      if (!filename || !password || !content) {
        return json({ error: '缺少参数' });
      }

      // 保存文件内容和密码
      await env.FILE_STORAGE.put(`file:${filename}`, content);
      await env.FILE_STORAGE.put(`pwd:${filename}`, password);

      // 保存文件的元数据
      const fileSize = new TextEncoder().encode(content).length;
      const fileCreatedTime = Date.now();
      await env.FILE_STORAGE.put(`metadata:${filename}`, JSON.stringify({
        size: fileSize,
        createdAt: fileCreatedTime
      }));

      const fileLink = `${url.origin}/read?filename=${encodeURIComponent(filename)}`;
      return json({ success: true, fileLink });
    }

    return new Response('👋 Worker 正常运行', { status: 200 });
  }
};

function json(obj) {
  return new Response(JSON.stringify(obj), {
    headers: { 'Content-Type': 'application/json;charset=utf-8' }
  });
}
