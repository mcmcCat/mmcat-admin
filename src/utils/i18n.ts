// translate router.meta.title, be used in breadcrumb sidebar tagsView
import i18n from '@/lang/index';

export function translateRouteTitleI18n(title: any) {
  // 判断是否存在国际化配置，如果没有，则直接原生返回
  const hasKey = i18n.global.te('route.' + title);
  if (hasKey) {
    const translatedTitle = i18n.global.t('route.' + title);
    return translatedTitle;
  }
  return title;
}
/* i18n.global.t 和 i18n.global.te 都是用于国际化(i18n)的函数，用于获取对应的翻译文本。它们的具体区别在于错误处理的方式。 */
// i18n.global.t 函数会在找不到对应的翻译文本时，返回传入的键(key)本身作为文本的值。这意味着如果找不到翻译文本，它将返回原始的键作为默认值。
// i18n.global.te 函数会在找不到对应的翻译文本时，返回 false。这意味着如果找不到翻译文本，它会返回一个布尔值，表示该键不存在。
