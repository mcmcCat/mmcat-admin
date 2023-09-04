import { defineStore } from "pinia";
import { RouteLocationNormalized } from "vue-router";

// Partial 是 TypeScript 中的一个工具类型（utility type）。它接受一个泛型参数，将该泛型参数表示的类型的所有属性都设置为可选的。
export interface TagView extends Partial<RouteLocationNormalized> {
  title?: string;
}

// setup
export const useTagsViewStore = defineStore("tagsView", () => {
  // state
  const visitedViews = ref<TagView[]>([]); // TagView其实就是路由对象
  const cachedViews = ref<string[]>([]);

  // actions
  function addVisitedView(view: TagView) {
    // 查看当前tagView中是否包含将要访问的路由对象
    if (visitedViews.value.some((v) => v.path === view.path)) return;

    // 路由信息没问题的话且判断是否固定位置（例如首页），选择按头插法还是尾插法，添加进tagView中
    if (view.meta && view.meta.affix) {
      visitedViews.value.unshift(
        Object.assign({}, view, {
          title: view.meta?.title || "no-name",
        })
      );
    } else {
      visitedViews.value.push(
        Object.assign({}, view, {
          title: view.meta?.title || "no-name",
        })
      );
    }
  }

  function addCachedView(view: TagView) {
    const viewName = view.name as string;
    if (cachedViews.value.includes(viewName)) return;
    if (view.meta?.keepAlive) {
      cachedViews.value.push(viewName);
    }
  }

  function delVisitedView(view: TagView) {
    return new Promise((resolve) => {
      for (const [i, v] of visitedViews.value.entries()) {
        if (v.path === view.path) {
          visitedViews.value.splice(i, 1);
          break;
        }
      }
      // 返回新的visitedViews数组
      resolve([...visitedViews.value]);
    });
  }

  function delCachedView(view: TagView) {
    const viewName = view.name as string;
    return new Promise((resolve) => {
      const index = cachedViews.value.indexOf(viewName);
      index > -1 && cachedViews.value.splice(index, 1);
      // 返回新的cachedViews数组
      resolve([...cachedViews.value]);
    });
  }

  function delOtherVisitedViews(view: TagView) {
    return new Promise((resolve) => {
      visitedViews.value = visitedViews.value.filter((v) => {
        // 只留下 固定位置的 和 当前的
        return v.meta?.affix || v.path === view.path;
      });
      resolve([...visitedViews.value]);
    });
  }

  function delOtherCachedViews(view: TagView) {
    const viewName = view.name as string;
    return new Promise((resolve) => {
      const index = cachedViews.value.indexOf(viewName);
      if (index > -1) {
        // 只留下点击【关闭其他】的那一个
        cachedViews.value = cachedViews.value.slice(index, index + 1);
      } else {
        // if index = -1, there is no cached tags
        cachedViews.value = [];
      }
      resolve([...cachedViews.value]);
    });
  }

  function updateVisitedView(view: TagView) {
    for (let v of visitedViews.value) {
      if (v.path === view.path) {
        v = Object.assign(v, view);
        break;
      }
    }
  }

  function addView(view: TagView) {
    // addVisitedView 函数用于将 view 对象添加到记录已访问的视图的集合中，用于跟踪用户访问过的视图历史。这样可以在需要时，比如实现导航、标签页等功能时，方便地获取和操作已访问的视图。
    addVisitedView(view);
    // addCachedView 函数用于将 view 对象添加到缓存的视图集合中，用于在某些情况下，如多次打开同一视图时，快速从缓存中恢复视图，而不需要重新渲染和初始化。
    addCachedView(view);
  }

  function delView(view: TagView) {
    return new Promise((resolve) => {
      delVisitedView(view);
      delCachedView(view);
      resolve({
        visitedViews: [...visitedViews.value],
        cachedViews: [...cachedViews.value],
      });
    });
  }

  function delOtherViews(view: TagView) {
    return new Promise((resolve) => {
      delOtherVisitedViews(view);
      delOtherCachedViews(view);
      resolve({
        visitedViews: [...visitedViews.value],
        cachedViews: [...cachedViews.value],
      });
    });
  }

  function delLeftViews(view: TagView) {
    return new Promise((resolve) => {
      // currIndex不是当前的tag的位置，而是右键选中的tag的位置
      const currIndex = visitedViews.value.findIndex(
        (v) => v.path === view.path
      );

      if (currIndex === -1) {
        return;
      }
      visitedViews.value = visitedViews.value.filter((item, index) => {
        // 当前项的索引大于等于 currIndex，或者当前项的 meta.affix 为 true 时，保留该项（即保留当前项及其右边的项）。
        // affix:true 固定tag，例如“首页”
        if (index >= currIndex || (item.meta && item.meta.affix)) {
          console.log(item);

          return true;
        }

        // 如果当前项在 cachedViews.value 中存在，则将其从 cachedViews.value 中删除，然后返回 false（即删除当前项）。
        const cacheIndex = cachedViews.value.indexOf(item.name as string);
        if (cacheIndex > -1) {
          cachedViews.value.splice(cacheIndex, 1);
        }
        return false;
      });
      resolve({
        visitedViews: [...visitedViews.value],
      });
    });
  }
  function delRightViews(view: TagView) {
    return new Promise((resolve) => {
      const currIndex = visitedViews.value.findIndex(
        (v) => v.path === view.path
      );
      if (currIndex === -1) {
        return;
      }
      visitedViews.value = visitedViews.value.filter((item, index) => {
        // affix:true 固定tag，例如“首页”
        if (index <= currIndex || (item.meta && item.meta.affix)) {
          return true;
        }

        const cacheIndex = cachedViews.value.indexOf(item.name as string);
        if (cacheIndex > -1) {
          cachedViews.value.splice(cacheIndex, 1);
        }
        return false;
      });
      resolve({
        visitedViews: [...visitedViews.value],
      });
    });
  }

  function delAllViews() {
    return new Promise((resolve) => {
      const affixTags = visitedViews.value.filter((tag) => tag.meta?.affix);
      visitedViews.value = affixTags;
      cachedViews.value = [];
      resolve({
        visitedViews: [...visitedViews.value],
        cachedViews: [...cachedViews.value],
      });
    });
  }

  function delAllVisitedViews() {
    return new Promise((resolve) => {
      const affixTags = visitedViews.value.filter((tag) => tag.meta?.affix);
      visitedViews.value = affixTags;
      resolve([...visitedViews.value]);
    });
  }

  function delAllCachedViews() {
    return new Promise((resolve) => {
      cachedViews.value = [];
      resolve([...cachedViews.value]);
    });
  }

  return {
    visitedViews,
    cachedViews,
    addVisitedView,
    addCachedView,
    delVisitedView,
    delCachedView,
    delOtherVisitedViews,
    delOtherCachedViews,
    updateVisitedView,
    addView,
    delView,
    delOtherViews,
    delLeftViews,
    delRightViews,
    delAllViews,
    delAllVisitedViews,
    delAllCachedViews,
  };
});
