import { ScrapComponent, GlobalSearchResult, ExternalComponent } from '../types/scrap';
import { ProjectRecipe } from '../types/scrap';
import { EXTERNAL_HARDWARE_DATABASE } from '../data/externalHardwareDb';

export interface GlobalSearchOutput {
  results: GlobalSearchResult[];
  totalMatches: number;
  inventoryCount: number;
  recipeCount: number;
  externalDbCount: number;
}

export function searchGlobalHardware(
  query: string,
  userInventory: ScrapComponent[],
  projectRecipes: ProjectRecipe[],
  externalDb: ExternalComponent[] = EXTERNAL_HARDWARE_DATABASE
): GlobalSearchOutput {
  const cleanQ = query.trim().toLowerCase();
  if (!cleanQ) {
    return {
      results: [],
      totalMatches: 0,
      inventoryCount: 0,
      recipeCount: 0,
      externalDbCount: 0
    };
  }

  const terms = cleanQ.split(/\s+/).filter(Boolean);
  const results: { result: GlobalSearchResult; score: number }[] = [];

  // 1. Search User Scrap Inventory
  for (const part of userInventory) {
    let score = 0;
    const matchedFields: string[] = [];

    const partNum = (part.partNumber || '').toLowerCase();
    const name = (part.name || '').toLowerCase();
    const cat = (part.category || '').toLowerCase();
    const pkg = (part.packageType || '').toLowerCase();
    const donor = (part.extractedFrom || '').toLowerCase();
    const notes = (part.notes || '').toLowerCase();
    const pins = (part.pinout || []).map(p => `${p.name} ${p.desc}`.toLowerCase()).join(' ');

    for (const term of terms) {
      if (partNum.includes(term)) {
        score += partNum === term ? 100 : 50;
        matchedFields.push(`Číslo dílu: ${part.partNumber}`);
      }
      if (name.includes(term)) {
        score += 30;
        matchedFields.push(`Název: ${part.name}`);
      }
      if (pkg.includes(term)) {
        score += 20;
        matchedFields.push(`Pouzdro: ${part.packageType}`);
      }
      if (donor.includes(term)) {
        score += 15;
        matchedFields.push(`Dárce: ${part.extractedFrom}`);
      }
      if (cat.includes(term)) {
        score += 15;
        matchedFields.push(`Kategorie: ${part.category}`);
      }
      if (pins.includes(term)) {
        score += 25;
        matchedFields.push(`Pinout: shoda pinu`);
      }
      if (notes.includes(term)) {
        score += 10;
      }
    }

    if (score > 0) {
      results.push({
        score,
        result: {
          id: `inv-${part.id}`,
          type: 'inventory',
          title: part.name,
          subtitle: `${part.partNumber} · ${part.packageType} · ${part.extractedFrom || 'Vlastní zásoba'}`,
          category: part.category,
          badge: `${part.quantity} ks na skladě`,
          badgeColor: 'emerald',
          data: part,
          matchedFields: Array.from(new Set(matchedFields))
        }
      });
    }
  }

  // 2. Search Available Project Recipes
  for (const recipe of projectRecipes) {
    let score = 0;
    const matchedFields: string[] = [];

    const title = (recipe.title || '').toLowerCase();
    const tagline = (recipe.tagline || '').toLowerCase();
    const desc = (recipe.description || '').toLowerCase();
    const cat = (recipe.category || '').toLowerCase();
    const partsText = (recipe.requiredParts || [])
      .map(p => `${p.componentName} ${p.partNumber} ${p.category} ${(p.alternatives || []).join(' ')}`)
      .join(' ')
      .toLowerCase();

    for (const term of terms) {
      if (title.includes(term)) {
        score += 60;
        matchedFields.push(`Projekt: ${recipe.title}`);
      }
      if (tagline.includes(term) || desc.includes(term)) {
        score += 25;
        matchedFields.push(`Popis projektu`);
      }
      if (partsText.includes(term)) {
        score += 40;
        matchedFields.push(`Potřebný díl v zapojení`);
      }
      if (cat.includes(term)) {
        score += 20;
        matchedFields.push(`Kategorie: ${recipe.category}`);
      }
    }

    if (score > 0) {
      // Calculate how many required parts user already has in inventory
      const required = recipe.requiredParts || [];
      const presentCount = required.filter(rp =>
        userInventory.some(
          inv =>
            inv.category === rp.category ||
            inv.partNumber.toLowerCase().includes(rp.partNumber.toLowerCase()) ||
            inv.name.toLowerCase().includes(rp.componentName.toLowerCase()) ||
            rp.componentName.toLowerCase().includes(inv.name.toLowerCase()) ||
            (rp.alternatives && rp.alternatives.some(alt => inv.name.toLowerCase().includes(alt.toLowerCase())))
        )
      ).length;
      const matchPct = required.length > 0 ? Math.round((presentCount / required.length) * 100) : 0;

      results.push({
        score,
        result: {
          id: `recipe-${recipe.id}`,
          type: 'recipe',
          title: recipe.title,
          subtitle: `${recipe.tagline} · ${recipe.difficulty} · ${recipe.estimatedBuildTime}`,
          category: recipe.category,
          badge: `${matchPct}% součástek ve šrotovišti`,
          badgeColor: matchPct >= 70 ? 'emerald' : matchPct >= 40 ? 'amber' : 'slate',
          data: recipe,
          matchedFields: Array.from(new Set(matchedFields))
        }
      });
    }
  }

  // 3. Search External Hardware Databases
  for (const ext of externalDb) {
    let score = 0;
    const matchedFields: string[] = [];

    const partNum = (ext.partNumber || '').toLowerCase();
    const name = (ext.name || '').toLowerCase();
    const desc = (ext.description || '').toLowerCase();
    const cat = (ext.category || '').toLowerCase();
    const pkg = (ext.packageType || '').toLowerCase();
    const sources = (ext.commonSources || '').toLowerCase();
    const equiv = (ext.equivalents || []).join(' ').toLowerCase();
    const pins = (ext.pinout || []).map(p => `${p.name} ${p.desc}`.toLowerCase()).join(' ');

    for (const term of terms) {
      if (partNum.includes(term)) {
        score += partNum === term ? 90 : 45;
        matchedFields.push(`Číslo čipu: ${ext.partNumber}`);
      }
      if (name.includes(term)) {
        score += 35;
        matchedFields.push(`Katalogový název`);
      }
      if (equiv.includes(term)) {
        score += 30;
        matchedFields.push(`Ekvivalentní náhrada`);
      }
      if (sources.includes(term)) {
        score += 20;
        matchedFields.push(`Kde zachránit: ${ext.commonSources}`);
      }
      if (pins.includes(term)) {
        score += 25;
        matchedFields.push(`Pinout: shoda pinu`);
      }
      if (desc.includes(term) || pkg.includes(term) || cat.includes(term)) {
        score += 15;
      }
    }

    if (score > 0) {
      results.push({
        score,
        result: {
          id: `ext-${ext.id}`,
          type: 'external_db',
          title: ext.name,
          subtitle: `${ext.partNumber} · ${ext.packageType} · ${ext.commonSources.slice(0, 70)}...`,
          category: ext.category,
          badge: 'Externí databáze & Datasheet',
          badgeColor: 'sky',
          data: ext,
          matchedFields: Array.from(new Set(matchedFields))
        }
      });
    }
  }

  // Sort descending by score
  results.sort((a, b) => b.score - a.score);

  const finalResults = results.map(r => r.result);

  return {
    results: finalResults,
    totalMatches: finalResults.length,
    inventoryCount: finalResults.filter(r => r.type === 'inventory').length,
    recipeCount: finalResults.filter(r => r.type === 'recipe').length,
    externalDbCount: finalResults.filter(r => r.type === 'external_db').length
  };
}
