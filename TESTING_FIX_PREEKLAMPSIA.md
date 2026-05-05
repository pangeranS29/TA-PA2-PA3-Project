# Testing Guide: Skrining Preeklampsia & DMG Dual-Table Fix

## Summary of Changes

### Problem Solved
1. ✅ Button not responding for Samuel Sitorus and siti astuti (only worked for Galder)
2. ✅ Data not saving to both `skrining_preeklampsia` AND `skrining_dm_gestasional` tables
3. ✅ Type mismatch: React sending empty strings but Go backend expected float64
4. ✅ Field name mismatch: `kesimpulan` vs `kesimpulan_skrining_preeklampsia`
5. ✅ Incorrect endpoint submission: All data going to preeklampsia endpoint only

## Files Modified

### Backend (Go)
1. **skrining_dm_gestasional.go** (Model)
   - Changed field types: `*float64` → `string` (4 gula darah fields)
   - Reason: Accept string input from React without parsing errors

2. **skrining_dm_gestasional_controller.go** (Controller)
   - Updated request struct: field types changed to `string`
   - Removed pointer conversions: `&req.GulaDarahPuasaHasil` → `req.GulaDarahPuasaHasil`
   - Fixed Update conditionals: `!= 0` → `!= ""` for string empty checks
   - Result: Can now properly handle string values from React

### Frontend (React)
**SkriningPreeklampsia.jsx**
- Import: Added `import api from "../../services/api"` for DMG endpoint
- State: Split single `form` into TWO states:
  - `formPreeklampsia`: preeklampsia checkbox/textarea fields
  - `formDMG`: gula darah input fields
- Handlers: Split into `handleChangePreeklampsia` and `handleChangeDMG`
- Fetch: `useEffect` now loads BOTH preeklampsia and DMG data
- Submit: `handleSubmit` NOW:
  1. Posts to `/skrining-preeklampsia` with preeklampsia data
  2. Posts to `/skrining-dm-gestasional` with DMG data
  3. Maps field correctly: `kesimpulan` → `kesimpulan_skrining_preeklampsia`
- Inputs: DMG fields now use correct field names:
  - `gula_darah_puasa_hasil`
  - `gula_darah_puasa_rencana_tindak_lanjut` (NOT just `rencana`)
  - `gula_darah_2_jam_post_prandial_hasil`
  - `gula_darah_2_jam_post_prandial_rencana_tindak_lanjut` (NOT just `rencana`)

## Pre-Testing Steps

### 1. Rebuild Backend
```bash
cd backend/monolith/go-template-main
go mod tidy
go build -o main ./cmd/main.go
# OR use: make build && make run
```
**Why:** Model and controller changes must be compiled and loaded into running server

### 2. Restart Backend Server
- Ensure port 8080 (or your configured port) is accessible
- Verify JWT middleware is working with test token

### 3. Verify API Endpoints Exist
```bash
# Test preeklampsia endpoint exists
curl -X GET http://localhost:8080/tenaga-kesehatan/skrining-preeklampsia/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test DMG endpoint exists  
curl -X GET http://localhost:8080/tenaga-kesehatan/skrining-dm-gestasional/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Testing Steps

### Test Case 1: Samuel Sitorus (ID: 1)
**Before:** Button didn't respond (likely kehamilan loading issue)
**Expected After:** Button responds + data saves to both tables

1. Navigate to: `/data-ibu/1/skrining-preeklampsia`
2. Check console for: "Kehamilan data:" log
3. If kehamilan list is empty, check:
   - Is Samuel's ibu ID correctly mapped?
   - Are there kehamilan records for this ibu?
   - Check API response: `/data-ibu?ibu_id=1`
4. Fill form:
   - Check 2-3 boxes under "Risiko Sedang"
   - Enter gula darah values: puasa = 90, 2 jam = 140
   - Enter rencana tindak lanjut for each
5. Click "Simpan & Lanjut..." button
6. **Expected**: 
   - No error message
   - Redirects to rujukan or pemeriksaan-rutin page
   - Data visible in BOTH database tables

### Test Case 2: Galder (ID: 2)
**Before:** Button worked (debugging reference)
**Expected After:** Still works + NOW saves to both tables

1. Navigate to: `/data-ibu/2/skrining-preeklampsia`
2. Verify kehamilan loads
3. Fill form same as above
4. Click save button
5. **Expected**: Same as Test Case 1

### Test Case 3: siti astuti (ID: 3)
**Before:** Button didn't respond (likely kehamilan loading issue)
**Expected After:** Button responds + data saves to both tables

1. Navigate to: `/data-ibu/3/skrining-preeklampsia`
2. Check console for kehamilan data
3. Fill and submit form
4. **Expected**: Same as Test Case 1

## Verification: Check Database

After each test, verify data in BOTH tables:

### Database Query 1: Preeklampsia
```sql
SELECT * FROM skrining_preeklampsia 
WHERE kehamilan_id = (SELECT id FROM kehamilan WHERE ibu_id = 1);
```
**Should see:** kesimpulan_skrining_preeklampsia, fisik_map_diatas_90_mmhg, etc.

### Database Query 2: DM Gestasional
```sql
SELECT * FROM skrining_dm_gestasional 
WHERE kehamilan_id = (SELECT id FROM kehamilan WHERE ibu_id = 1);
```
**Should see:** gula_darah_puasa_hasil, gula_darah_puasa_rencana_tindak_lanjut, etc.

## Debugging: Console Logs

Browser console should show:
```javascript
// Loading phase
"Kehamilan data: [...]"

// Submit phase
"Skrining preeklampsia saved: {...}"
"Skrining DMG saved: {...}"

// Success
"Skrining berhasil disimpan ke kedua tabel!"
```

## Troubleshooting

### Issue: Button still doesn't respond
- Check console for errors (Ctrl+F12)
- If "Kehamilan data: []" → Add kehamilan for this ibu
- If "Cannot read property 'id'" → kehamilan object is null
- Check network tab for failed API calls

### Issue: Only preeklampsia data saved, not DMG
- Check network tab for DMG endpoint POST request
- Verify field names match backend exactly:
  - `gula_darah_puasa_rencana_tindak_lanjut` (not `rencana`)
- Check backend logs for parsing errors

### Issue: "Gagal: ..." message appears
- Check `err.response?.data?.message` in console
- Common: Type mismatch (should be fixed now)
- Common: Missing kehamilan_id in payload
- Common: JWT token expired

### Issue: 404 Not Found errors
- Verify backend is running: `curl http://localhost:8080/health`
- Verify routes registered: Check `routes.go` lines 303-307
- Verify middleware isn't blocking: Check JWT middleware
- Verify port is correct in frontend config

## Success Criteria

✅ Button responds to click for ALL 3 patients (Samuel, Galder, siti)
✅ Form submits without error
✅ Preeklampsia data appears in `skrining_preeklampsia` table
✅ DMG data appears in `skrining_dm_gestasional` table
✅ Both records have same `kehamilan_id` (proof of dual save)
✅ User is redirected to next page after success
✅ Console shows no errors, only success logs

## Next Steps If Issues Occur

1. Check session memory for debugging notes: `/memories/session/debugging.md`
2. Review original conversation summary for context
3. Verify all 3 file modifications were applied correctly
4. Compare your actual database schema with expected fields
5. Verify Go and Node.js versions haven't caused compatibility issues
