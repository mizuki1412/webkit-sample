export function string2Download(content, title) {
  const blob = new Blob([content], {
    type: "text/plain",
  })
  if ("download" in document.createElement("a")) {
    // 非IE下载
    const elink = document.createElement("a")
    elink.download = title
    elink.style.display = "none"
    elink.href = URL.createObjectURL(blob)
    document.body.appendChild(elink)
    elink.click()
    URL.revokeObjectURL(elink.href) // 释放URL 对象
    document.body.removeChild(elink)
  } else {
    // IE10+下载
    navigator.msSaveBlob(blob, title)
  }
}
