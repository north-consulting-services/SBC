# Process Overview graphic

Visual overview of the S&BSP process for ceremonies and presentations.

## Files

| File | Purpose |
|------|---------|
| [`assets/process-ceremony-overview.svg`](../assets/process-ceremony-overview.svg) | Editable vector source |
| [`assets/process-ceremony-overview-ltr.png`](../assets/process-ceremony-overview-ltr.png) | Raster export for slides / print |

## Layout

### PATH A — Happy path (green, top row)

1. Applications  
2. Sponsor Meetings  
3. Present to Board  
4. Board reviews with Elders  
5. Approved / Award Money + Ongoing Check-Ins  

Plus the ongoing **Sponsor / Board Review** cadence (1st / 2nd / 3rd).

### Decline paths (orange, under PATH A)

| Path | When | Outcome |
|------|------|---------|
| **PATH B** | After Sponsor Meetings | Sponsor Declines with Notes |
| **PATH C** | After Present to Board | Board Declines with Notes |
| **PATH D** | After Board reviews with Elders | Elders Decline with Notes |

## Editing

1. Edit the SVG.  
2. Re-export PNG:

```bash
python3 -c "import cairosvg; cairosvg.svg2png(url='assets/process-ceremony-overview.svg', write_to='assets/process-ceremony-overview-ltr.png', output_width=3600, output_height=1640)"
```
