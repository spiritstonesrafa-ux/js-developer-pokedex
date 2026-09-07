(function () {
  const masterArt = Object.freeze({
    aster:'assets/images/trainers/aster.png', kael:'assets/images/trainers/kael.png',
    marina:'assets/images/trainers/marina.png', volt:'assets/images/trainers/volt.png',
    flora:'assets/images/trainers/flora.png', yara:'assets/images/trainers/yara.png',
    dante:'assets/images/trainers/dante.png', vesper:'assets/images/trainers/vesper.png',
    terra:'assets/images/trainers/terra.png', aero:'assets/images/trainers/aero.png',
    orion:'assets/images/trainers/orion.png', nilo:'assets/images/trainers/nilo.png',
    petra:'assets/images/trainers/petra.png', nyra:'assets/images/trainers/nyra.png',
    riven:'assets/images/trainers/riven.png', noctis:'assets/images/trainers/noctis.png',
    ferrum:'assets/images/trainers/ferrum.png', lumi:'assets/images/trainers/lumi.png'
  });
  const masters = Object.freeze([
    ['master-normal','aster','Aster','normal','AS'],['master-fire','kael','Kael','fire','KA'],['master-water','marina','Marina','water','MA'],['master-electric','volt','Volt','electric','VO'],['master-grass','flora','Flora','grass','FL'],['master-ice','yara','Yara','ice','YA'],['master-fighting','dante','Dante','fighting','DA'],['master-poison','vesper','Vesper','poison','VE'],['master-ground','terra','Terra','ground','TE'],['master-flying','aero','Aero','flying','AE'],['master-psychic','orion','Orion','psychic','OR'],['master-bug','nilo','Nilo','bug','NI'],['master-rock','petra','Petra','rock','PE'],['master-ghost','nyra','Nyra','ghost','NY'],['master-dragon','riven','Riven','dragon','RI'],['master-dark','noctis','Noctis','dark','NO'],['master-steel','ferrum','Ferrum','steel','FE'],['master-fairy','lumi','Lumi','fairy','LU']
  ].map(([id,avatarKey,displayName,type,initials]) => Object.freeze({ id, avatarKey, displayName, type, avatarSrc:masterArt[avatarKey] || null, thumbnailSrc:'assets/images/trainers/thumbs/' + avatarKey + '.webp', alt:'Retrato de ' + displayName, initials, variant:'MASTER' })));
  const special = Object.freeze({
    SUPER: Object.freeze({ id:'super-trainer', avatarKey:'super-trainer', displayName:'Super Trainer', type:null, avatarSrc:'assets/images/trainers/super-trainer.png', alt:'Retrato do Super Trainer', initials:'ST', variant:'SUPER' }),
    SHADOW: Object.freeze({ id:'shadow-super-trainer', avatarKey:'super-trainer-shadow', displayName:'Shadow Super Trainer', type:null, avatarSrc:'assets/images/trainers/super-trainer-shadow.png', alt:'Retrato do Shadow Super Trainer', initials:'ST', variant:'SHADOW' })
  });
  const byId = Object.freeze(Object.fromEntries(masters.map(entry => [entry.id, entry])));
  const api = Object.freeze({
    MASTER_TRAINER_VISUALS: masters, SPECIAL_TRAINER_VISUALS: special,
    getMasterVisual: challengeId => byId[String(challengeId)] || null,
    getSpecialTrainerVisual: variant => special[String(variant).toUpperCase()] || null
  });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else { window.PBACampaign = window.PBACampaign || {}; Object.assign(window.PBACampaign, api); }
})();
