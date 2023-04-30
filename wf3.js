const wfd = require('waveform-data');
const decode = require('audio-decode');
const { of, map, from, switchMap } = require('rxjs');
const { promises } = require('fs');
const { Blob } = require('buffer');
const buffer = require('audio-lena/mp3');
const Mp32Wav = require('mp3-to-wav');
const fs = require('fs');
const WaveFile = require('wavefile').WaveFile;

module.exports = {
    peaks: function(file, callback) {

        audioPeaksFromFile(file, 356).subscribe(callback);

    }
};

function audioPeaksFromFile(audiofile, samples) {
    /*
    return of(audiofile).pipe(
        switchMap(filepath => {
            return from(promises.readFile(filepath))
        }),
        map(filedata => new _Blob([filedata.buffer])),
        switchMap(blob => from(blob.arrayBuffer())),
        switchMap(arrayBuffer => from(decode(arrayBuffer))),
        map(audioBuffer => filterData(audioBuffer, samples ? samples : 70, false)),
        map(filteredData => normalizeData(filteredData, false)),
        map(normalizedData => normalizedData[0])
    );

     */

    return of(audiofile).pipe(
        switchMap(filepath => {
            return from(promises.readFile(filepath))
        }),
        map(filedata => new Blob([filedata.buffer])),
        switchMap(blob => from(blob.arrayBuffer())),
        switchMap(arrayBuffer => from(decode(arrayBuffer))),
        map(audioBuffer => filterData(audioBuffer, samples ? samples : 70, true)),
        map(filteredData => normalizeData(filteredData, false)),
        map(normalizedData => normalizedData[0])
    );
}

const filterData = (audioBuffer, samples, allchannels) => {
    //console.log(audioBuffer);

    const channels = allchannels ? audioBuffer.numberOfChannels : 1;
    let filteredDataChannels = [];
        let currentchannel = 0;
        for (currentchannel = 0; currentchannel < channels; currentchannel++) {
            const rawData = audioBuffer.getChannelData(currentchannel); // We only need to work with one channel of data

            //console.log('channel', currentchannel, 'data', rawData.length, samples, rawData.length / samples);

            const blockSize = Math.floor(rawData.length / samples); // the number of samples in each subdivision
            const filteredData = [];

            for (let i = 0; i < samples; i++) {
                let blockStart = blockSize * i; // the location of the first sample in the block
                let sum = 0;

                for (let j = 0; j < blockSize; j++) {
                    sum = sum + Math.abs(rawData[blockStart + j]); // find the sum of all the samples in the block
                }
                filteredData.push(sum / blockSize); // divide the sum by the block size to get the average
            }
            filteredDataChannels[currentchannel] = filteredData;
        }
    return filteredDataChannels;
};

const normalizeData = filteredDataChannels => {
    let multipliers = [];
    let normalized = [];
    filteredDataChannels.map((c, i) => {
        let multiplier = Math.pow(Math.max(...c), -1);
        normalized[i] = c.map(n => n * multiplier);
    });
    return normalized;
}