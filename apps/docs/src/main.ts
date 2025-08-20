import { Renderer, GeneTrack } from '@ovb/renderer';
import { Gff3Adapter } from '@ovb/adapter-gff3';

// 1. Get the mount element
const mount = document.getElementById('app');
if (!mount) {
  throw new Error('Could not find mount element with id "app"');
}

// 2. Create the main renderer instance
const renderer = new Renderer(mount, 'chr1:1000-5000');

// 3. Create a data adapter
//    (Using the mocked adapter for now)
const gff3Adapter = new Gff3Adapter({
  url: '/mock-data/genes.gff3.gz',
  indexUrl: '/mock-data/genes.gff3.gz.tbi',
});

// 4. Create a track
const geneTrack = new GeneTrack({
  id: 'genes',
  name: 'Genes',
  adapter: gff3Adapter,
});

// 5. Add the track to the renderer
renderer.addTrack(geneTrack);
