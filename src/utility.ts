export const twitterShareTxt =
  "https://twitter.com/intent/tweet?url=&text=%40NotionBoost%20by%20%40GorvGoyl%20adds%20tons%20of%20capabilities%20to%20%40NotionHQ%20like%20outline%2C%20scroll%20top%20button%2C%20hide%20slash%20command%20menu%20and%20many%20more!"
// stays on doc change
const notionFrameCls = ".notion-frame"
const DEBUG = false
// these gets removed on doc change
const notionScrollerCls = ".notion-frame .notion-scroller.vertical"
const notionPageContentCls = ".notion-page-content"
const notionPresenceContainerCls = ".notion-presence-container"

/**
 *  add listener for page change or window reload event
 *
 *  accepts array of functions
 * @param {*} callbacksAfterDocReady call any function after notion doc is ready
 * @param {*} callbacksAfterContentReady call any function after notion doc content is loaded (async)
 * @return {*} observer object which can be used to disconnect pageChangeListener
 */
export function pageChangeListener(
  callbacksAfterDocReady,
  callbacksAfterContentReady
) {
  console.log(`listening to page change events`)

  const pageChangeObserverObj = new MutationObserver((mutationList, obsrvr) => {
    console.log("new page opened")

    // check if scroller class is loaded
    if (getElement(notionScrollerCls)) {
      for (let i = 0; i < callbacksAfterDocReady.length; i++) {
        callbacksAfterDocReady[i]()
      }
      // now wait for notionPresenceContainerCls to be loaded
      onElementLoaded(notionPresenceContainerCls, notionScrollerCls)
        .then((isPresent) => {
          if (isPresent) {
            for (let i = 0; i < callbacksAfterContentReady.length; i++) {
              callbacksAfterContentReady[i]()
            }
          }
          return null
        })
        .catch((e) => console.log(e))
    }
  })

  const docFrameEl = getElement(notionFrameCls)

  pageChangeObserverObj.observe(docFrameEl, {
    childList: true
  })
  return pageChangeObserverObj
}

export function removePageChangeListener(pageChangeObserverObj) {
  if (isObserverType(pageChangeObserverObj)) {
    console.log("disconnected pageChangeObserver")
    pageChangeObserverObj.disconnect()
  }
}

export function isObserverType(obj) {
  return obj.disconnect !== undefined
}

/**
 *
 * Wait for an HTML element to be loaded like `div`, `span`, `img`, etc.
 * ex: `onElementLoaded("div.some_class").then(()=>{}).catch(()=>{})`
 * @param elementToObserve wait for this element to load
 * @param parentStaticElement (optional) if parent element is not passed then `document` is used
 * @return Promise - return promise when `elementToObserve` is loaded
 */
export function onElementLoaded(
  elementToObserve: string,
  parentStaticElement: string = undefined
) {
  DEBUG && console.log(`waiting for element: ${elementToObserve}`)
  const promise = new Promise<boolean>((resolve, reject) => {
    try {
      if (getElement(elementToObserve)) {
        DEBUG && console.log(`element already present: ${elementToObserve}`)
        resolve(true)
        return
      }
      const parentElement = parentStaticElement
        ? getElement(parentStaticElement)
        : document

      const observer = new MutationObserver((mutationList, obsrvr) => {
        const divToCheck = getElement(elementToObserve)
        // console.log("checking for div...");

        if (divToCheck) {
          console.log(`element loaded: ${elementToObserve}`)
          obsrvr.disconnect() // stop observing
          resolve(true)
        }
      })

      // start observing for dynamic div
      observer.observe(parentElement, {
        childList: true,
        subtree: true
      })
    } catch (e) {
      console.log(e)
      reject(Error("some issue... promise rejected"))
    }
  })
  return promise
}

// detect if css is changed for a div (once)
export function onElementCSSChanged(divClassToObserve, timeOut) {
  DEBUG && console.log(`waiting for element: ${divClassToObserve}`)
  const promise = new Promise((resolve, reject) => {
    try {
      const observer = new MutationObserver((mutationList, obsrvr) => {
        mutationList.forEach((mutation) => {
          if (mutation.attributeName === "style") {
            console.log("style change")
            obsrvr.disconnect() // stop observing
            resolve(true)
          }
        })
      })

      // start observing for dynamic div
      observer.observe(divClassToObserve, {
        attributes: true,
        attributeFilter: ["style"]
      })

      if (timeOut) {
        setTimeout(() => {
          observer.disconnect()
          console.log(`observer disconnected after ${timeOut}`)
        }, timeOut)
      }
    } catch (e) {
      console.log(e)
      reject(Error("some issue... promise rejected"))
    }
  })
  return promise
}

// create html node from string like $('div')
export function toElement(s) {
  let e = document.createElement("div")
  const r = document.createRange()
  r.selectNodeContents(e)
  const f = r.createContextualFragment(s)
  e.appendChild(f)
  // @ts-ignore
  e = e.firstElementChild
  return e
}
// export function toElement(
//   s = "",
//   c,
//   t = document.createElement("template"),
//   l = "length"
// ) {
//   t.innerHTML = s.trim();
//   c = [...t.content.childNodes];
//   return c[l] > 1 ? c : c[0] || "";
// }

// run func every x millisec and stop after y millisec
export function runMethod(func, runEvery, stopAfter) {
  const process = setInterval(func, runEvery)

  setTimeout(() => {
    console.log("stopped")
    clearInterval(process)
  }, stopAfter)
}

export function removeChildren(el) {
  while (el.firstChild) el.removeChild(el.firstChild)
}
export function getElement(selector) {
  return document.querySelector(selector)
}
export function getElements(selector) {
  return document.querySelectorAll(selector)
}
// ugly method to check for empty
export function isEmpty(obj) {
  // boolean like false = non-empty
  if (obj === false || obj === true) return false

  // empty string, null is empty
  if (!obj) return true

  // empty object = empty
  if (Object.keys(obj).length === 0) return true
  return false
}

export function simulateKey(key) {
  switch (key) {
    case "esc": {
      window.dispatchEvent(
        new KeyboardEvent("keydown", {
          altKey: false,
          code: "Escape",
          ctrlKey: false,
          isComposing: false,
          key: "Escape",
          location: 0,
          metaKey: false,
          repeat: false,
          shiftKey: false,
          which: 27,
          charCode: 0,
          keyCode: 27
        })
      )
      break
    }
    default:
      console.error("key not implemented", key)
  }
}

export function extractNotionPageId(url: string): string | null {
  // 尝试匹配直接在路径中的页面ID
  const directMatch = url.match(/notion\.so\/.*?([a-f0-9]{32})/);
  if (directMatch && directMatch[1]) {
    return formatPageId(directMatch[1]);
  }

  // 尝试匹配作为查询参数的页面ID
  const urlObj = new URL(url);
  const pageIdParam = urlObj.searchParams.get('p');
  if (pageIdParam) {
    return formatPageId(pageIdParam);
  }

  // 如果没有找到匹配项，返回null
  return null;
}

// 新增一个函数来格式化页面ID
function formatPageId(pageId: string): string {
  // 使用正则表达式插入破折号
  return pageId.replace(/^([a-f0-9]{8})([a-f0-9]{4})([a-f0-9]{4})([a-f0-9]{4})([a-f0-9]{12})$/, '$1-$2-$3-$4-$5');
}
