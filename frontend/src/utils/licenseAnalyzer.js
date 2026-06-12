const LICENSE_META = {
  'MIT': {
    name: 'MIT License',
    riskLevel: 'low',
    permissive: true,
    copyleft: false,
    description: '非常宽松的开源许可证，几乎无限制，只需保留版权声明。',
    url: 'https://opensource.org/licenses/MIT'
  },
  'Apache-2.0': {
    name: 'Apache License 2.0',
    riskLevel: 'low',
    permissive: true,
    copyleft: false,
    description: '宽松许可证，要求保留版权声明和 NOTICE 文件，包含专利授权。',
    url: 'https://www.apache.org/licenses/LICENSE-2.0'
  },
  'BSD-3-Clause': {
    name: 'BSD 3-Clause License',
    riskLevel: 'low',
    permissive: true,
    copyleft: false,
    description: '宽松许可证，要求保留版权声明，禁止使用作者名背书。',
    url: 'https://opensource.org/licenses/BSD-3-Clause'
  },
  'BSD-2-Clause': {
    name: 'BSD 2-Clause License',
    riskLevel: 'low',
    permissive: true,
    copyleft: false,
    description: '简化版 BSD，要求保留版权声明。',
    url: 'https://opensource.org/licenses/BSD-2-Clause'
  },
  'Unlicense': {
    name: 'The Unlicense',
    riskLevel: 'low',
    permissive: true,
    copyleft: false,
    description: '放弃版权，相当于公有领域。',
    url: 'https://unlicense.org/'
  },
  'ISC': {
    name: 'ISC License',
    riskLevel: 'low',
    permissive: true,
    copyleft: false,
    description: '功能等同于 MIT 的精简版许可证。',
    url: 'https://opensource.org/licenses/ISC'
  },
  'MPL-2.0': {
    name: 'Mozilla Public License 2.0',
    riskLevel: 'medium',
    permissive: false,
    copyleft: 'weak',
    description: '弱 Copyleft，修改的文件需开源，可与闭源代码结合。',
    url: 'https://www.mozilla.org/en-US/MPL/2.0/'
  },
  'LGPL-3.0': {
    name: 'GNU Lesser General Public License v3.0',
    riskLevel: 'medium',
    permissive: false,
    copyleft: 'weak',
    description: '弱 Copyleft，动态链接库方式使用时无需开源你的代码。',
    url: 'https://www.gnu.org/licenses/lgpl-3.0.en.html'
  },
  'LGPL-2.1': {
    name: 'GNU Lesser General Public License v2.1',
    riskLevel: 'medium',
    permissive: false,
    copyleft: 'weak',
    description: 'LGPL 旧版本，与 v3.0 类似但条款有差异。',
    url: 'https://www.gnu.org/licenses/old-licenses/lgpl-2.1.en.html'
  },
  'GPL-3.0': {
    name: 'GNU General Public License v3.0',
    riskLevel: 'high',
    permissive: false,
    copyleft: 'strong',
    description: '强 Copyleft，衍生作品必须以相同许可证开源。',
    url: 'https://www.gnu.org/licenses/gpl-3.0.en.html'
  },
  'GPL-2.0': {
    name: 'GNU General Public License v2.0',
    riskLevel: 'high',
    permissive: false,
    copyleft: 'strong',
    description: '强 Copyleft，衍生作品必须以相同许可证开源，与 GPL-3.0 不兼容。',
    url: 'https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html'
  },
  'AGPL-3.0': {
    name: 'GNU Affero General Public License v3.0',
    riskLevel: 'high',
    permissive: false,
    copyleft: 'network',
    description: '最强 Copyleft，网络服务（SaaS）使用也需开源整个服务代码。',
    url: 'https://www.gnu.org/licenses/agpl-3.0.en.html'
  },
  'SSPL': {
    name: 'Server Side Public License',
    riskLevel: 'high',
    permissive: false,
    copyleft: 'network',
    description: 'MongoDB 等使用的类 AGPL 许可证，作为服务提供时需开源整个服务栈。非 OSI 认可的开源许可证。',
    url: 'https://www.mongodb.com/licensing/server-side-public-license'
  },
  'BSL': {
    name: 'Business Source License',
    riskLevel: 'high',
    permissive: false,
    copyleft: false,
    description: '源码可用许可证，通常经过一段时间后转为开源许可证，但在商业生产环境使用有严格限制。',
    url: 'https://mariadb.com/bsl-faq-adopting/'
  },
  'Proprietary': {
    name: 'Proprietary / Commercial',
    riskLevel: 'high',
    permissive: false,
    copyleft: false,
    description: '专有商业许可证，使用限制由许可协议决定，可能不允许修改和再分发。',
    url: null
  }
}

const normalizeLicense = (license) => {
  if (!license) return null
  const upper = String(license).trim()
  const mapping = {
    'gpl': 'GPL-3.0',
    'gplv3': 'GPL-3.0',
    'gpl3': 'GPL-3.0',
    'gpl v3': 'GPL-3.0',
    'gpl v2': 'GPL-2.0',
    'gplv2': 'GPL-2.0',
    'gpl2': 'GPL-2.0',
    'agpl': 'AGPL-3.0',
    'agplv3': 'AGPL-3.0',
    'lgpl': 'LGPL-3.0',
    'lgplv3': 'LGPL-3.0',
    'lgplv2': 'LGPL-2.1',
    'lgpl2.1': 'LGPL-2.1',
    'apache': 'Apache-2.0',
    'apache2': 'Apache-2.0',
    'apache v2': 'Apache-2.0',
    'mit': 'MIT',
    'bsd': 'BSD-3-Clause',
    'bsd3': 'BSD-3-Clause',
    'bsd 3 clause': 'BSD-3-Clause',
    'bsd 2 clause': 'BSD-2-Clause',
    'bsd2': 'BSD-2-Clause',
    'mpl': 'MPL-2.0',
    'mpl2': 'MPL-2.0',
    'isc': 'ISC',
    'unlicense': 'Unlicense',
    'public domain': 'Unlicense',
    'cc0': 'Unlicense',
    'sspl': 'SSPL',
    'bsl': 'BSL',
    'commercial': 'Proprietary',
    'proprietary': 'Proprietary',
    'closed source': 'Proprietary'
  }
  return mapping[upper.toLowerCase()] || (LICENSE_META[upper] ? upper : null)
}

const getLicenseMeta = (license) => {
  const normalized = normalizeLicense(license)
  if (!normalized) return null
  return LICENSE_META[normalized] || null
}

const INCOMPATIBLE_PAIRS = [
  {
    a: 'GPL-3.0',
    b: 'GPL-2.0',
    level: 'high',
    message: 'GPL-3.0 与 GPL-2.0 代码库无法直接混合使用，两者许可证条款不兼容。'
  },
  {
    a: 'GPL-3.0',
    b: 'AGPL-3.0',
    level: 'medium',
    message: 'AGPL-3.0 代码可并入 GPL-3.0 项目，但反之不行。请确认合并方向。'
  },
  {
    a: 'GPL-2.0',
    b: 'AGPL-3.0',
    level: 'high',
    message: 'GPL-2.0 与 AGPL-3.0 条款不兼容，两者通常无法在同一项目中使用。'
  },
  {
    a: 'GPL-3.0',
    b: 'Apache-2.0',
    level: 'low',
    message: 'Apache-2.0 代码可并入 GPL-3.0 项目（GPL-3.0 明确兼容 Apache-2.0），但反过来将 GPL-3.0 代码以 Apache 发布不可行。'
  },
  {
    a: 'GPL-2.0',
    b: 'Apache-2.0',
    level: 'high',
    message: 'GPL-2.0 与 Apache-2.0 不兼容。Apache 许可证的专利条款与 GPL-2.0 冲突。'
  },
  {
    a: 'MPL-2.0',
    b: 'GPL-2.0',
    level: 'high',
    message: 'MPL-2.0 代码不能直接并入 GPL-2.0 项目。可考虑升级到 GPL-3.0 或使用 MPL 次级许可。'
  },
  {
    a: 'SSPL',
    b: 'MIT',
    level: 'medium',
    message: 'SSPL 不是 OSI 认可的开源许可证。将 SSPL 代码与 MIT 代码组合可能污染 MIT 部分的使用自由度。'
  },
  {
    a: 'SSPL',
    b: 'Apache-2.0',
    level: 'medium',
    message: 'SSPL 非 OSI 认可的开源许可证，与 Apache-2.0 组合使用需谨慎评估服务端分发场景。'
  },
  {
    a: 'BSL',
    b: 'MIT',
    level: 'medium',
    message: 'BSL 不是开源许可证，在变更期内与 MIT 代码合并使用会受到商业使用限制。'
  }
]

const findIncompatiblePair = (licA, licB) => {
  const a = normalizeLicense(licA)
  const b = normalizeLicense(licB)
  if (!a || !b) return null
  return INCOMPATIBLE_PAIRS.find(p =>
    (p.a === a && p.b === b) || (p.a === b && p.b === a)
  )
}

const analyzeFavorites = (favorites) => {
  const warnings = []
  const items = []

  for (const fav of favorites) {
    const normalized = normalizeLicense(fav.license || fav.License)
    const meta = normalized ? LICENSE_META[normalized] : null

    items.push({
      id: fav.id,
      name: fav.name || fav.Name,
      licenseRaw: fav.license || fav.License,
      licenseNormalized: normalized,
      licenseUrl: fav.license_url || fav.LicenseUrl,
      meta
    })

    if (!normalized) {
      warnings.push({
        type: 'no-license',
        level: 'warning',
        targetId: fav.id,
        targetName: fav.name || fav.Name,
        title: '缺少许可证信息',
        message: `资源「${fav.name || fav.Name}」没有标注许可证，使用风险未知。请在项目集成前确认其授权条款。`
      })
    }
  }

  const licensedItems = items.filter(i => i.licenseNormalized)
  const hasAGPL = licensedItems.some(i => i.licenseNormalized === 'AGPL-3.0')
  const hasSSPL = licensedItems.some(i => i.licenseNormalized === 'SSPL')
  const hasGPL = licensedItems.some(i => ['GPL-2.0', 'GPL-3.0'].includes(i.licenseNormalized))
  const hasProprietary = licensedItems.some(i => i.licenseNormalized === 'Proprietary')
  const hasBSL = licensedItems.some(i => i.licenseNormalized === 'BSL')

  for (let i = 0; i < licensedItems.length; i++) {
    for (let j = i + 1; j < licensedItems.length; j++) {
      const pair = findIncompatiblePair(
        licensedItems[i].licenseNormalized,
        licensedItems[j].licenseNormalized
      )
      if (pair) {
        warnings.push({
          type: 'incompatible',
          level: pair.level,
          pair: [licensedItems[i], licensedItems[j]],
          title: `许可证组合风险：${licensedItems[i].licenseNormalized} + ${licensedItems[j].licenseNormalized}`,
          message: pair.message
        })
      }
    }
  }

  if (hasAGPL && licensedItems.length >= 2) {
    warnings.push({
      type: 'agpl-network',
      level: 'high',
      title: 'AGPL-3.0 网络服务义务提醒',
      message: '你收藏了 AGPL-3.0 许可的库。如果通过网络向用户提供该软件的服务（SaaS），AGPL-3.0 要求你向所有用户开放整个服务的源代码。请结合业务场景评估合规成本。'
    })
  }

  if (hasSSPL) {
    warnings.push({
      type: 'sspl-warning',
      level: 'high',
      title: 'SSPL 非开源许可证提醒',
      message: 'SSPL 不是 OSI 认可的开源许可证。如果你将相关软件作为服务对外提供，SSPL 要求你开源整个服务栈（包括未修改的第三方基础设施代码），合规风险很高。'
    })
  }

  if (hasBSL) {
    warnings.push({
      type: 'bsl-warning',
      level: 'medium',
      title: 'BSL 源码可用许可证提醒',
      message: 'BSL 不是开源许可证，通常在变更日期（Change Date）之前对生产环境使用有限制。请查看具体项目的 BSL 条款，确认是否允许你的使用场景。'
    })
  }

  if (hasGPL) {
    const gplItems = licensedItems.filter(i => ['GPL-2.0', 'GPL-3.0'].includes(i.licenseNormalized))
    warnings.push({
      type: 'gpl-copyleft',
      level: 'medium',
      title: 'GPL 强 Copyleft 提醒',
      message: `你收藏了 ${gplItems.length} 个 GPL 系列库（${gplItems.map(i => i.licenseNormalized).join('、')}）。如果你的项目与这些库形成衍生作品并对外分发，整个项目可能需要以相同 GPL 许可证开源。请咨询法务确认。`,
      relatedItems: gplItems
    })
  }

  if (hasProprietary) {
    warnings.push({
      type: 'proprietary',
      level: 'medium',
      title: '专有许可证提醒',
      message: '你收藏了标注为 Proprietary（专有/商业）的资源。请仔细阅读其许可协议，确认是否允许你的使用方式、是否允许修改和再分发。'
    })
  }

  const levelPriority = { high: 3, medium: 2, warning: 1, low: 0 }
  warnings.sort((a, b) => (levelPriority[b.level] || 0) - (levelPriority[a.level] || 0))

  const stats = {
    total: items.length,
    licensed: licensedItems.length,
    noLicense: items.length - licensedItems.length,
    byRisk: {
      low: licensedItems.filter(i => i.meta?.riskLevel === 'low').length,
      medium: licensedItems.filter(i => i.meta?.riskLevel === 'medium').length,
      high: licensedItems.filter(i => i.meta?.riskLevel === 'high').length
    }
  }

  return { items, warnings, stats }
}

export {
  LICENSE_META,
  normalizeLicense,
  getLicenseMeta,
  analyzeFavorites,
  findIncompatiblePair
}
