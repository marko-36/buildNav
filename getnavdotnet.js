/*
    Function GetNavMain010(ByVal SqlComX As SqlClient.SqlCommand, ByVal access As Integer, ByVal thisnavid As Integer, Optional ByVal locale As String = "en")
        Dim SqlRxX As System.Data.SqlClient.SqlDataReader
        Dim level As Integer = 1
        Dim isnode As Boolean
        Dim navhtml As String
        navhtml = "<ul id=""nav_main""><!--li><a class=""_amenu"" href=""javascript:void(0);"">&nbsp;</a></li-->"
        SqlComX.CommandText = "SELECT navid, navname, pagetitle, pageh1, page, paramset, filename, navclass, css3 FROM dbo.z_nav WHERE nav_locale ='" & locale & "' AND navid > 1000000000 AND navid < 2000000000 And (access Is null Or access <=" & access & ") ORDER BY navid, navname"
        SqlRxX = SqlComX.ExecuteReader()
        While SqlRxX.Read()
            If IsDBNull(SqlRxX(4)) Then isnode = True Else isnode = False       '//is (not) a node, add a <ul> link for navigation on touch displays
            If level = 1 And SqlRxX(0).ToString.Substring(2, 4) <> "0000" Then  '//level1 -> level2
                level = 2
            ElseIf level = 2 And SqlRxX(0).ToString.Substring(6, 4) <> "0000" Then '//level2 -> level3
                level = 3
            End If
            If level = 3 And SqlRxX(0).ToString.Substring(6, 4) = "0000" Then       '//level3 -> level2
                navhtml += "</ul></li>"
                level = 2
                If level = 2 And SqlRxX(0).ToString.Substring(4, 4) = "0000" Then   '//level2 -> level1
                    navhtml += "</ul></li>"
                    level = 1
                End If
            End If
            If level = 2 And SqlRxX(0).ToString.Substring(4, 4) = "0000" Then       '//level2 -> level1
                navhtml += "</ul></li>"
                level = 1
            End If

            navhtml += "<li class=""_n" & SqlRxX(4)                         '//CSS for a url
            If Not IsDBNull(SqlRxX(6)) Then navhtml += " _n" & SqlRxX(6)    '//CSS for a filename (can exist for a filename, not a page/url)
            If isnode Then navhtml += " _node"                              '//is a node
            'If (level = 1 And SqlRxX(0).ToString.Substring(0, 2) = thisnavid.ToString.Substring(0, 2)) Or (level = 2 And SqlRxX(0).ToString.Substring(0, 4) = thisnavid.ToString.Substring(0, 4)) Or SqlRxX(0) = thisnavid.ToString Then navhtml += " _ispath"         '//current link is a part of current page's path
            'If thisnavid - SqlRxX(0) > 0 Then If (level = 1 And thisnavid - SqlRxX(0) < 100000000) Or (level = 2 And thisnavid - SqlRxX(0) < 100000000 And thisnavid - SqlRxX(0) < 9999) Then navhtml += " _ispath"        '//current link is a part of current page's path
            If thisnavid > SqlRxX(0) Then
                If level = 1 And thisnavid - SqlRxX(0) < 100000000 Then navhtml += " _ispath"       '//current link is a part of current page's path
                If level = 2 And thisnavid - SqlRxX(0) < 10000 Then navhtml += " _ispath"           '//current link is a part of current page's path
            ElseIf SqlRxX(0) = thisnavid.ToString Then
                navhtml += " _isthispage"   //current link is current page
            End If
            navhtml += """><a href="""
            If isnode Then
                navhtml += "javascript:void(0);"
            ElseIf SqlRxX(4) <> "/" Then
                navhtml += "/" & SqlRxX(4) & "/"
            Else
                navhtml += "/" 'is the homepage
            End If

            If Not IsDBNull(SqlRxX(5)) Then navhtml += SqlRxX(5)    '//if paramset in not null, add it (querystrings, anchors)
            navhtml += """><b>" & SqlRxX(1) & "</b></a>"

            If isnode Then                                          '//is a node, add a <ul> link for navigation on touch displays
                navhtml += "<ul>"
            Else
                navhtml += "</li>"
            End If
        End While
        SqlRxX.Close()
        If level = 3 Then navhtml += "</ul></li></ul></li>"
        If level = 2 Then navhtml += "</ul></li>"
        navhtml += "</ul>"
        Return navhtml
    End Function
    */