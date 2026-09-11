try {
  $word = New-Object -ComObject Word.Application
  $word.Visible = $false
  $docPath = (Get-Item "Fundsroom_Full_Stack_Case_Study_Solution.docx").FullName
  $pdfPath = [System.IO.Path]::ChangeExtension($docPath, ".pdf")
  $doc = $word.Documents.Open($docPath)
  $doc.SaveAs([ref]$pdfPath, [ref]17)
  $doc.Close()
  $word.Quit()
  Write-Output "SUCCESS: $pdfPath"
} catch {
  Write-Output "FAILED: $($_.Exception.Message)"
}
