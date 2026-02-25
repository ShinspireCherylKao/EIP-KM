"""
Modify km-recent.js to:
1. In renderFileTable, replace the blind restore of upload/newFolder buttons with permission-aware logic
2. Add _canEditCurrent variable 
3. Wrap the folder row more-menu-wrapper in a conditional
4. Wrap the file row more-menu-wrapper in a conditional
"""

path = r'c:\Users\C1-0074\Desktop\AIPT\EIP-KM - 0116\EIP-KM - 0114\前台\js\km-recent.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

changes = 0

# === Change 1: Replace upload/newFolder button restore logic ===
old1 = """    // 還原上傳檔案與新增資料夾按鈕
    const uploadBtn = document.getElementById('uploadBtn');
    const newFolderBtn = document.getElementById('newFolderBtn');
    if (uploadBtn) uploadBtn.style.display = '';
    if (newFolderBtn) newFolderBtn.style.display = '';"""

new1 = """    // 還原上傳檔案與新增資料夾按鈕（若有權限控制函式則交由它決定）
    const uploadBtn = document.getElementById('uploadBtn');
    const newFolderBtn = document.getElementById('newFolderBtn');
    if (typeof window._hasFolderEditPerm === 'function' && currentFolder) {
        const canEdit = window._hasFolderEditPerm(currentFolder);
        if (uploadBtn)    uploadBtn.style.display    = canEdit ? '' : 'none';
        if (newFolderBtn) newFolderBtn.style.display  = canEdit ? '' : 'none';
    } else {
        if (uploadBtn) uploadBtn.style.display = '';
        if (newFolderBtn) newFolderBtn.style.display = '';
    }"""

if old1 in content:
    content = content.replace(old1, new1, 1)
    changes += 1
    print("Change 1: OK - upload/newFolder button logic")
else:
    print("Change 1: FAILED - could not find upload button restore block")

# === Change 2: Add _canEditCurrent variable before subFolders map ===
old2 = """    // 子資料夾列
    const favFolders = JSON.parse(localStorage.getItem('favoriteFolders') || '[]');
    let folderHtml = subFolders.map(sf => {"""

new2 = """    // 子資料夾列
    const favFolders = JSON.parse(localStorage.getItem('favoriteFolders') || '[]');
    // 權限判斷：當前資料夾是否可編輯
    const _canEditCurrent = (typeof window._hasFolderEditPerm === 'function' && currentFolder)
        ? window._hasFolderEditPerm(currentFolder) : true;
    let folderHtml = subFolders.map(sf => {"""

if old2 in content:
    content = content.replace(old2, new2, 1)
    changes += 1
    print("Change 2: OK - added _canEditCurrent variable")
else:
    print("Change 2: FAILED - could not find subFolders block")

# === Change 3: Wrap folder row more-menu-wrapper ===
# Find the first <div class="more-menu-wrapper"> occurrence in renderFileTable's subFolders.map
# It starts after toggleFolderFavorite and before selectFolder
old3_start = '                        <div class="more-menu-wrapper">\n                            <button class="btn small ghost" onclick="event.stopPropagation(); toggleMoreMenu(event, \'${safeName}\')" title="更多操作">'
old3_end = """                            </div>
                        </div>
                    </div>
                </td>
            </tr>`;"""

# Find them
idx3_start = content.find(old3_start)
if idx3_start >= 0:
    idx3_end = content.find(old3_end, idx3_start)
    if idx3_end >= 0:
        old3_block = content[idx3_start:idx3_end + len(old3_end)]
        # The more-menu-wrapper div block (without the outer </div></td></tr>)
        wrapper_end_pos = old3_block.find('                            </div>\n                        </div>')
        wrapper_block = old3_block[:wrapper_end_pos + len('                            </div>\n                        </div>')]
        
        new3_block = '                        ${_canEditCurrent ? `' + wrapper_block[24:] + '` : \'\'}\n                    </div>\n                </td>\n            </tr>`;'
        
        content = content[:idx3_start] + new3_block + content[idx3_end + len(old3_end):]
        changes += 1
        print("Change 3: OK - folder row more-menu-wrapper conditional")
    else:
        print("Change 3: FAILED - could not find end marker for folder row")
else:
    print("Change 3: FAILED - could not find folder row more-menu-wrapper")

# === Change 4: Wrap file row more-menu-wrapper ===
# Find the second occurrence of more-menu-wrapper (for files)
# The file one has toggleMoreMenu with file.name.replace, not safeName
file_marker = "toggleMoreMenu(event, '${file.name.replace"
idx4_marker = content.find(file_marker)
if idx4_marker >= 0:
    # Find the <div class="more-menu-wrapper"> before this
    wrapper_start = content.rfind('<div class="more-menu-wrapper">', 0, idx4_marker)
    # Find the closing of this wrapper: </div>\n                        </div>
    # After the dropdown closes (</div>), then the wrapper closes (</div>)
    dropdown_end = content.find('                            </div>\n                        </div>\n                    </div>\n                </td>\n            </tr>', wrapper_start)
    
    if wrapper_start >= 0 and dropdown_end >= 0:
        wrapper_end = dropdown_end + len('                            </div>\n                        </div>')
        old_wrapper = content[wrapper_start:wrapper_end]
        
        # Wrap with conditional
        new_wrapper = '${_canEditCurrent ? `' + old_wrapper + '` : \'\'}'
        
        content = content[:wrapper_start] + new_wrapper + content[wrapper_end:]
        changes += 1
        print("Change 4: OK - file row more-menu-wrapper conditional")
    else:
        print(f"Change 4: FAILED - wrapper_start={wrapper_start}, dropdown_end={dropdown_end}")
else:
    print("Change 4: FAILED - could not find file toggleMoreMenu marker")

# Write back
with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\nDone! {changes}/4 changes applied.")
