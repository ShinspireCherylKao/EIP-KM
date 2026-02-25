import re

path = r'c:\Users\C1-0074\Desktop\AIPT\EIP-KM - 0116\EIP-KM - 0114\前台\js\km-recent.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find the 2nd occurrence of toggleMoreMenu (the one in file rows, not folder rows)
idx1 = content.find('toggleMoreMenu(event')
idx2 = content.find('toggleMoreMenu(event', idx1 + 1)
print(f'1st toggleMoreMenu at: {idx1}')
print(f'2nd toggleMoreMenu at: {idx2}')

# Get surrounding context
if idx2 > 0:
    # Find the start of the more-menu-wrapper div before idx2
    wrapper_start = content.rfind('<div class="more-menu-wrapper">', 0, idx2)
    # Find the end (closing </div> tags)
    # After the more-menu-dropdown closes, we need 2 more closing </div>
    search_from = idx2
    # Find '</div>\n                        </div>' after the dropdown
    end_marker = content.find('</div>\n                        </div>\n                    </div>\n                </td>', search_from)
    
    if wrapper_start > 0 and end_marker > 0:
        end_pos = end_marker + len('</div>\n                        </div>')
        old_block = content[wrapper_start:end_pos]
        print(f'\nOLD BLOCK ({len(old_block)} chars):')
        print(repr(old_block[:200]))
        print('...')
        print(repr(old_block[-100:]))
        
        new_block = "${_canEditCurrent ? `" + old_block + "` : ''}"
        content = content[:wrapper_start] + new_block + content[end_pos:]
        
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print('\nFile updated successfully!')
    else:
        print(f'wrapper_start: {wrapper_start}, end_marker: {end_marker}')
        if end_marker < 0:
            # Try to find what's actually after the dropdown
            snippet = content[search_from:search_from+600]
            print(f'Context after 2nd toggleMoreMenu:\n{repr(snippet)}')
