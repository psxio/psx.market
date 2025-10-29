-- Add portfolio media to 3D builders
UPDATE builders SET 
  portfolio_media = ARRAY['https://picsum.photos/seed/alex3d1/600/400', 'https://picsum.photos/seed/alex3d2/600/400', 'https://picsum.photos/seed/alex3d3/600/400', 'https://picsum.photos/seed/alex3d4/600/400']
WHERE id = 'b3d001';

UPDATE builders SET 
  portfolio_media = ARRAY['https://picsum.photos/seed/maya3d1/600/400', 'https://picsum.photos/seed/maya3d2/600/400', 'https://picsum.photos/seed/maya3d3/600/400']
WHERE id = 'b3d002';

UPDATE builders SET 
  portfolio_media = ARRAY['https://picsum.photos/seed/jordan3d1/600/400', 'https://picsum.photos/seed/jordan3d2/600/400']
WHERE id = 'b3d003';

UPDATE builders SET 
  portfolio_media = ARRAY['https://picsum.photos/seed/sophia3d1/600/400', 'https://picsum.photos/seed/sophia3d2/600/400', 'https://picsum.photos/seed/sophia3d3/600/400', 'https://picsum.photos/seed/sophia3d4/600/400']
WHERE id = 'b3d004';

-- Add portfolio media to KOL builders
UPDATE builders SET 
  portfolio_media = ARRAY['partner:Blur', 'partner:Magic Eden', 'partner:Uniswap', 'partner:1inch', 'partner:PumpFun', 'partner:DexScreener', 'partner:CoinGecko', 'partner:DexTools']
WHERE id = 'bkol001';

UPDATE builders SET 
  portfolio_media = ARRAY['partner:Tensor', 'partner:Raydium', 'partner:Jupiter', 'partner:PumpFun', 'partner:DexScreener', 'partner:Birdeye']
WHERE id = 'bkol002';

UPDATE builders SET 
  portfolio_media = ARRAY['partner:Aerodrome', 'partner:Synthetix', 'partner:Velodrome', 'partner:Base']
WHERE id = 'bkol003';

UPDATE builders SET 
  portfolio_media = ARRAY['partner:PumpFun', 'partner:DexTools', 'partner:CoinMarketCap', 'partner:CoinGecko', 'partner:Birdeye', 'partner:DEXScreener']
WHERE id = 'bkol004';

-- Add to Graphic Design builders
UPDATE builders SET 
  portfolio_media = ARRAY['https://picsum.photos/seed/diana1/600/400', 'https://picsum.photos/seed/diana2/600/400', 'https://picsum.photos/seed/diana3/600/400']
WHERE id = 'bgfx001';

UPDATE builders SET 
  portfolio_media = ARRAY['https://picsum.photos/seed/pete1/600/400', 'https://picsum.photos/seed/pete2/600/400']
WHERE id = 'bgfx002';

UPDATE builders SET 
  portfolio_media = ARRAY['https://picsum.photos/seed/max1/600/400', 'https://picsum.photos/seed/max2/600/400']
WHERE id = 'bgfx003';

-- Add to Video Editing builders
UPDATE builders SET 
  portfolio_media = ARRAY['https://picsum.photos/seed/eddie1/600/400', 'https://picsum.photos/seed/eddie2/600/400', 'https://picsum.photos/seed/eddie3/600/400']
WHERE id = 'bvid001';

UPDATE builders SET 
  portfolio_media = ARRAY['https://picsum.photos/seed/clara1/600/400', 'https://picsum.photos/seed/clara2/600/400']
WHERE id = 'bvid002';

UPDATE builders SET 
  portfolio_media = ARRAY['https://picsum.photos/seed/tommy1/600/400', 'https://picsum.photos/seed/tommy2/600/400']
WHERE id = 'bvid003';
