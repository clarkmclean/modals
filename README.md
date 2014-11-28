modals
======

Modals with css animations.  Made custom for RC Willey Home Furnishings

Uses CSS animations from: http://tympanus.net/Development/ModalWindowEffects/


To create a url that initiates a popup on arrival:
1. http://www.rcwilley.com/Example.jsp?popup=true
2. http://www.rcwilley.com/Example.jsp?popup=true&popupOptions={ options }
      ---Options---
      String      type:           (inline, iframe, image, ajax, or actual contents)
      Boolean     modal
      String      url             (Must be URL encoded)
      Integer     width
      Integer     height
      Boolean     imageviewer
      Integer     mdCloseDelay:   milliseconds
      String      title:          First <h1> in contents
      
 3. Delimiters for name/value are '+' and '_'. (i.e. { name1 }_{ value1 }+{ name2 }_{ value2 })
 
      ---YouTube---
      http://www.rcwilley.com/Example.jsp?youtube={ youtube_id }
