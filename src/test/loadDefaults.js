import twisted from 'twisted'

import {Summoner} from '../models/Summoner.js'
import {trackedSummoners} from '../models/TrackedSummoners.js'

const Constants = twisted.Constants;

function loadDefaultSummoners(channelID){
    const b3rd3m_EUW = new Summoner("b3rd3m", 'rYRrlBWCGAd_wY894XmauyVAb_dwlRO0ahC0T3XRjFpphAUhaoZwNvdDvac3rMA5I8cDcXmzboYyUA', Constants.Regions.EU_WEST, Constants.TftRegions.EUROPE);
    const Baerekyba_EUW = new Summoner("Baerekyba", 'fiyqESSAhUYRQ6Y6PxLtftMw9a5r9RsFwac72z44DeTVSO0EI2yN2mRZ3pd00Fdds3PuqbGrCiD_MQ', Constants.Regions.EU_WEST, Constants.TftRegions.EUROPE);
    const DiePotato_EUW = new Summoner("DiePotato", 'wU8_Nvfzf28CyMjUleZrAYqPlH-pxcsEh-9QdQp7Let-CmKnWyBKVZFxHivMi23dEFXZLGwqATGbXQ', Constants.Regions.EU_WEST, Constants.TftRegions.EUROPE);
    const Lie_Lie_Lie_NA = new Summoner("Lie Lie Lie", 'b14MjImnc4-TbRgJ4SnF0lxR2WTLyHN9ZMhksOOdVNLaQbowlr_AkhtTyAP1H4x-KC-Iw7vu6kOxtg', Constants.Regions.AMERICA_NORTH, Constants.TftRegions.AMERICAS);
    const b3rd3m_NA = new Summoner("b3rd3m", '9KKB60JrtztzgEO1gbBVzVzCsrxOPpbNaaxh-_Tq_Z8kGreMtEcZmYwwAPc-LE2wVyHGxaABnMi_KA', Constants.Regions.AMERICA_NORTH, Constants.TftRegions.AMERICAS);
    const TurkishDelight3_NA = new Summoner("TurkishDelight3", 'kMzadYV3qz9kudnaDcL7N9VKL0mMXL_8Ve1RgCsif_kAUnzjmMJxrNbnOiRNaYIiHd73hS6tQKxYyg', Constants.Regions.AMERICA_NORTH, Constants.TftRegions.AMERICAS);
    const BB_Borako_NA = new Summoner("BB Borako", 'sS4UtC9F0c5m599IBEQKAaTXmPeCOy0tgR9YvRg8DhbXVC1vXctpRhX9sgS8hQb9mUIx8-vK0dDILA', Constants.Regions.AMERICA_NORTH, Constants.TftRegions.AMERICAS);

    trackedSummoners.addAll(channelID, [b3rd3m_EUW, Baerekyba_EUW, DiePotato_EUW, Lie_Lie_Lie_NA, b3rd3m_NA, TurkishDelight3_NA, BB_Borako_NA]);
}

export {loadDefaultSummoners};
