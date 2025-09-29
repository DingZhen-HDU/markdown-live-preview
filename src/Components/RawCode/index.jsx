import React from "react";
import { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { basicSetup } from "codemirror";
import { EditorView } from "@codemirror/view";
import { markdown } from "@codemirror/lang-markdown";

import "./index.scss";
// import defaultText from "@/assets/defaultText";
import { updateInput } from "@/store/modules/inputStore";

const RawCode = React.forwardRef((props, ref) => {
  const editorRef = useRef(null);
  const viewRef = useRef(null);
  const dispatch = useDispatch();

  const input = useSelector((state) => state.input.value);

  useEffect(() => {
    let saveTimer;
    if (!editorRef.current) return;

    const fixedHeightEditor = EditorView.theme({
      "&": {
        minHeight: "100%",
        maxHeight: "100%",
        width: "100%", // ✅ 固定宽度
        overflow: "hidden",
      },
      ".cm-scroller": { overflow: "auto" },
      ".cm-content": {
        padding: "0",
        margin: "0",
      },
    });

    // ✅ 监听编辑器变化并同步到 Redux
    const updateInputListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        console.log("changed");
        const newContent = update.state.doc.toString();
        dispatch(updateInput(newContent)); // ✅ 实时更新 Redux Store
        clearTimeout(saveTimer);
        saveTimer = setTimeout(() => {
          try {
            localStorage.setItem("markdown-content", newContent);
          } catch (error) {
            console.warn("Failed to save to localStorage:", error);
          }
        }, 500); // 500ms 内最后一次变更才保存
      }
    });

    // 创建 EditorView
    const view = new EditorView({
      doc: input,
      parent: editorRef.current,
      extensions: [
        basicSetup,
        markdown(), // 支持 Markdown 语法
        EditorView.lineWrapping, // 自动换行
        fixedHeightEditor,
        updateInputListener,
      ],
    });

    viewRef.current = view;

    // 🔥 把 view 实例和 DOM 暴露给父组件
    if (ref) {
      ref.current = {
        view,
        dom: view.dom,
        scrollDOM: view.scrollDOM, // 真实滚动容器
      };
    }

    // 清理函数
    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
      }
    };
  }, [dispatch]);

  useEffect(() => {
    if (viewRef.current) {
      // 只有当外部状态改变时才更新编辑器内容
      const currentContent = viewRef.current.state.doc.toString();
      if (currentContent !== input) {
        viewRef.current.dispatch({
          changes: {
            from: 0,
            to: currentContent.length,
            insert: input,
          },
        });
      }
    }
  }, [input]);

  return (
    <div
      ref={editorRef}
      className="raw-code"
      style={{
        margin: 0, // 确保父 div 无外边距
        padding: 0, // 无内边距
      }}
    ></div>
  );
});

export default RawCode;
