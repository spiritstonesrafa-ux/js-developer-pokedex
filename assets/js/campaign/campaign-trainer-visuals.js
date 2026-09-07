(function () {
  const masters = Object.freeze([
    ['master-normal','aster','Aster','normal','AS'],['master-fire','kael','Kael','fire','KA'],['master-water','marina','Marina','water','MA'],['master-electric','volt','Volt','electric','VO'],['master-grass','flora','Flora','grass','FL'],['master-ice','yara','Yara','ice','YA'],['master-fighting','dante','Dante','fighting','DA'],['master-poison','vesper','Vesper','poison','VE'],['master-ground','terra','Terra','ground','TE'],['master-flying','aero','Aero','flying','AE'],['master-psychic','orion','Orion','psychic','OR'],['master-bug','nilo','Nilo','bug','NI'],['master-rock','petra','Petra','rock','PE'],['master-ghost','nyra','Nyra','ghost','NY'],['master-dragon','riven','Riven','dragon','RI'],['master-dark','noctis','Noctis','dark','NO'],['master-steel','ferrum','Ferrum','steel','FE'],['master-fairy','lumi','Lumi','fairy','LU']
  ].map(([id,avatarKey,displayName,type,initials]) => Object.freeze({ id, avatarKey, displayName, type, avatarSrc:null, alt:'Retrato de ' + displayName, initials, variant:'MASTER' })));
  const special = Object.freeze({
    SUPER: Object.freeze({ id:'super-trainer', avatarKey:'super-trainer', displayName:'Super Trainer', type:null, avatarSrc:null, alt:'Retrato do Super Trainer', initials:'ST', variant:'SUPER' }),
    SHADOW: Object.freeze({ id:'shadow-super-trainer', avatarKey:'super-trainer-shadow', displayName:'Shadow Super Trainer', type:null, avatarSrc:null, alt:'Retrato do Shadow Super Trainer', initials:'ST', variant:'SHADOW' })
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
