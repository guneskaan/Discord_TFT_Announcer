import twisted from 'twisted'

const TftApi = new twisted.TftApi();

async function maybeAnnounceNewTFTMatch(summoner, channel){  
    try {
      const matchList = await TftApi.Match.list(summoner.puuid, summoner.TFTRegion)
      const TFTMatch = await retrieveSingleMatch(matchList, summoner)
      return TFTMatch ? sendMatchUpdate(TFTMatch, summoner, channel) : null
    }
    catch (error) {
      console.log(error)
      channel.send(`Error fetching match history for Summoner ${summoner.name}.`)
    }
}
  
function retrieveSingleMatch(matchList, summoner){
    console.log('Retrieved Matchlist', matchList);
  
    // Case where the Summoner hasn't played any TFT Games.
    if(!matchList.response || matchList.response.length == 0){
      return;
    }
  
    const lastMatchId = matchList.response[0];
    // Case where we are fetching Summoner's match history for the first time.
    if (!summoner.lastMatchId){
      summoner.lastMatchId = lastMatchId;
      return;
    }
    
    // Case where the Summoner hasn't finished a new TFTMatch.
    if (summoner.lastMatchId == lastMatchId)
      return;
  
    summoner.lastMatchId = lastMatchId;
  
    return TftApi.Match.get(lastMatchId, summoner.TFTRegion);
}
  
function sendMatchUpdate(TFTMatch, summoner, channel){
    console.log('Retrieved TFTMatch: ', TFTMatch);
  
    const participant = TFTMatch.response.info.participants.find(p => p.puuid === summoner.puuid);
  
    var traitList = participant.traits.filter(trait => trait.tier_current && trait.tier_current > 0);
    traitList.sort((trait1, trait2) => {
      return trait2.num_units - trait1.num_units;
    });
  
    const buildPlacementString = placement => {
      switch (placement){
        case 1:
          return "1st";
        case 2:
          return "2nd";
        case 3:
          return "3rd";
        default:
          return placement.toString() + "th";
      }
    }
  
    const buildTraitString = trait => {
      const traitName = trait.name;
      const slicedTraitName = traitName.startsWith('Set3') ? traitName.slice(5) : traitName;
      
      return trait.num_units + ' ' + slicedTraitName;
    }
  
    const compString = traitList.reduce((prevTrait, curTrait, index) => index == 0 ? buildTraitString(curTrait) : prevTrait + ', ' + buildTraitString(curTrait), '');
    
    channel.send(`Summoner ${summoner.name}(${summoner.region}) just placed ${buildPlacementString(participant.placement)} in a TFT Match.\nComposition:`);
    channel.send(compString);
}

export {maybeAnnounceNewTFTMatch};
  