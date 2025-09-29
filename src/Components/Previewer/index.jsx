import React, { useRef, useMemo, useEffect } from "react";
import { marked } from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import DOMPurify from "dompurify";

import "./index.scss";
// import defaultText from "public/assets/defaultText";

import { useSelector } from "react-redux";

marked.setOptions({
  langPrefix: "hljs language-", // highlight.js 的 class 前缀
  highlight: function (code, lang) {
    const language = hljs.getLanguage(lang) ? lang : "plaintext";
    return hljs.highlight(code, { language }).value;
  },
  pedantic: false,
  gfm: true, // 支持 GitHub Flavored Markdown
  breaks: true, // 将换行符转为 <br>
});

const Previewer = React.forwardRef((props, ref) => {
  const content = useSelector((state) => state.input.value);
  const previewerRef = useRef(null);
  // const html = useSelector((state) =>
  //   DOMPurify.sanitize(marked.parse(state.input.value))
  // );

  // 使用 useMemo 缓存解析结果，避免重复渲染开销
  const htmlContent = useMemo(() => {
    const rawHtml = marked(content);
    const cleanHtml = DOMPurify.sanitize(rawHtml); // 清理恶意脚本
    return { __html: cleanHtml };
  }, [content]);

  // 🔥 暴露 DOM 给父组件
  useEffect(() => {
    if (ref) {
      ref.current = {
        dom: previewerRef.current,
        scrollDOM: previewerRef.current, // 预览区自己滚动
      };
    }
  }, [ref]);

  return (
    <div ref={previewerRef} className="previewer">
      <div className="item" dangerouslySetInnerHTML={htmlContent} />
    </div>
  );
});

export default Previewer;
