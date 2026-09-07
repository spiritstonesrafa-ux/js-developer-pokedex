(function () {
  const TYPE_ICONS = Object.freeze({normal:'⚪',fire:'🔥',water:'💧',electric:'⚡',grass:'🌿',ice:'❄️',fighting:'🥊',poison:'☠️',ground:'🌍',flying:'🕊️',psychic:'🔮',bug:'🐛',rock:'🪨',ghost:'👻',dragon:'🐉',dark:'🌑',steel:'⚙️',fairy:'✨'});
  const SIZES = Object.freeze({ SMALL:48, MEDIUM:88, LARGE:144 });
  const escape = value => String(value || '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  function renderTrainerAvatar(descriptor, options = {}) {
    if (!descriptor || !descriptor.avatarKey || !descriptor.displayName) return '';
    const size = SIZES[String(options.size || 'MEDIUM').toUpperCase()] ? String(options.size || 'MEDIUM').toUpperCase() : 'MEDIUM';
    const shape = String(options.shape || 'PORTRAIT').toUpperCase() === 'CIRCLE' ? 'CIRCLE' : 'PORTRAIT';
    const decorative = !!options.decorative;
    const showTypeAccent = options.showTypeAccent !== false;
    const thumbnailSrc = typeof descriptor.thumbnailSrc === 'string' && descriptor.thumbnailSrc.trim() ? descriptor.thumbnailSrc.trim() : null;
    const avatarSrc = options.surface === 'CARD' && thumbnailSrc ? thumbnailSrc : (typeof descriptor.avatarSrc === 'string' && descriptor.avatarSrc.trim() ? descriptor.avatarSrc.trim() : null);
    const type = descriptor.type && TYPE_ICONS[descriptor.type] ? descriptor.type : '';
    const classes = ['trainer-avatar','trainer-avatar--' + size.toLowerCase(),'trainer-avatar--' + shape.toLowerCase(),'trainer-avatar--' + String(descriptor.variant || 'MASTER').toLowerCase()];
    if (showTypeAccent && type) classes.push('type-' + type);
    const label = escape(descriptor.alt || ('Retrato de ' + descriptor.displayName));
    const fallback = '<span class="trainer-avatar__fallback" ' + (avatarSrc ? 'hidden' : '') + ' aria-hidden="true"><span class="trainer-avatar__type-icon">' + (type ? TYPE_ICONS[type] : '✦') + '</span><span class="trainer-avatar__initials">' + escape(descriptor.initials) + '</span></span>';
    const image = avatarSrc ? '<img class="trainer-avatar__image" src="' + escape(avatarSrc) + '" alt="' + label + '" width="' + SIZES[size] + '" height="' + SIZES[size] + '" loading="' + (options.loading === 'eager' ? 'eager' : 'lazy') + '" decoding="async" onerror="this.hidden=true;this.nextElementSibling.hidden=false;this.parentElement.classList.add(&quot;trainer-avatar--image-failed&quot;)">' : '';
    return '<div class="' + classes.join(' ') + '" data-avatar-key="' + escape(descriptor.avatarKey) + '" role="' + (decorative ? 'presentation' : 'img') + '"' + (decorative ? ' aria-hidden="true"' : ' aria-label="' + label + '"') + '>' + image + fallback + '</div>';
  }
  const api = Object.freeze({ TRAINER_AVATAR_SIZES:SIZES, TYPE_ICONS, renderTrainerAvatar });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else { window.PBACampaign = window.PBACampaign || {}; Object.assign(window.PBACampaign, api); }
})();
