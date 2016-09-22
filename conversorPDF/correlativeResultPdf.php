<?php

include_once 'pdf/fpdf.php';
include_once 'util.php';

class PDF extends FPDF
{
	var $terminal;

	function setTerminal($unaTerminal){
		$this->terminal = $unaTerminal;
	}

	function Header()
	{
		//Logo
		$this->Image('imagenes/logoPuerto.jpg',10,8,45);
		//Arial bold 15
		$this->SetFont('Arial','B',16);
		//Movernos a la derecha

		//Título
		$this->SetX(50);
		$this->Cell(110,10,utf8_decode('Sistema de Control de Terminales'),0,0,'C');
		$this->Ln();
		$this->SetX(50);
		$this->Cell(110,10,utf8_decode('Control de correlatividad'),0,0,'C');

		switch ($this->terminal){
			case 'BACTSSA':
				$this->Image('imagenes/logo_bactssa.jpg', 160, 8, 40);
				break;
			case 'TERMINAL4':
				$this->Image('imagenes/logo_terminal4.jpg', 160, 8, 40);
				break;
			case 'TRP':
				$this->Image('imagenes/logo_trp.jpg', 160, 8, 40);
				break;
		}
		//Salto de línea
		$this->Ln(15);
	}

	function Footer()
	{
		//Posición: a 1,5 cm del final
		$this->SetY(-15);
		$y = $this->GetY();
		$this->Line(10, $y, 200, $y);
		//Arial italic 8
		$this->SetFont('Arial','I',8);
		//Número de página
		$this->Cell(20,10,utf8_decode('Página ').$this->PageNo().'/{nb}',0,0,'L');
		$this->Cell(165, 10, utf8_decode("Administración General de Puertos S.E. - Departamento de Desarrollo"), 0, 0, "R");
		//$this->Image("imagenes/logo_puertochico.jpg", $this->GetX(), $this->GetY() + 2, 5);
	}

	function CheckPageBreak($h)
	{
		//If the height h would cause an overflow, add a new page immediately
		if($this->GetY()+$h>$this->PageBreakTrigger)
			$this->AddPage($this->CurOrientation);
	}

	function NbLines($w, $txt)
	{
		//Computes the number of lines a MultiCell of width w will take
		$cw=&$this->CurrentFont['cw'];
		if($w==0)
			$w=$this->w-$this->rMargin-$this->x;
		$wmax=($w-2*$this->cMargin)*1000/$this->FontSize;
		$s=str_replace("\r", '', $txt);
		$nb=strlen($s);
		if($nb>0 and $s[$nb-1]=="\n")
			$nb--;
		$sep=-1;
		$i=0;
		$j=0;
		$l=0;
		$nl=1;
		while($i<$nb)
		{
			$c=$s[$i];
			if($c=="\n")
			{
				$i++;
				$sep=-1;
				$j=$i;
				$l=0;
				$nl++;
				continue;
			}
			if($c==' ')
				$sep=$i;
			$l+=$cw[$c];
			if($l>$wmax)
			{
				if($sep==-1)
				{
					if($i==$j)
						$i++;
				}
				else
					$i=$sep+1;
				$sep=-1;
				$j=$i;
				$l=0;
				$nl++;
			}
			else
				$i++;
		}
		return $nl;
	}
}

$data = get_post();

$desde = date('d/m/Y', strtotime($data['desde']));
$hasta = date('d/m/Y', strtotime($data['hasta']));
$hoy = date('d/m/Y', strtotime($data['hoy']));

$pdf = new PDF();
$pdf->setTerminal($data['terminal']);
$pdf->AliasNbPages();
$pdf->AddPage();

$pdf->SetFont('Arial', 'B', 14);
$pdf->Cell(190, 8, utf8_decode($data['titulo']), 0, "L");
$pdf->Ln();
$pdf->SetFont('Arial', 'B', 10);
$pdf->Cell(190, 8, utf8_decode('Reporte generado el ' . $hoy), 0, "L");
$pdf->Ln();
$pdf->Cell(190, 8, utf8_decode('Período controlado: Del ' . $desde . ' hasta el ' . $hasta), 0, "L");
$pdf->Ln(10);

$pdf->SetFillColor(51, 153, 255);

$first = true;

foreach ($data['resultado'] as $puntoDeVenta) {

	$textoResultado = '';
	$last = end($puntoDeVenta['resultadoCorrelativo']);

	foreach ($puntoDeVenta['resultadoCorrelativo'] as $resultado){
		if ($last == $resultado){
			$textoResultado .= $resultado['n'];
		} else {
			$textoResultado .= $resultado['n'] . " - ";
		}
	}

	$inicio = '';
	if ($puntoDeVenta['totalCnt'] > 1){
		$inicio = "Se hallaron " . $puntoDeVenta['totalCnt'] . " comprobantes faltantes:\n\n";
	} else {
		$inicio = "Se halló 1 comprobante faltante:\n\n";
	}

	$textoResultado = "\n" . $inicio . $textoResultado . "\n ";

	//Calculate the height of the row
	$nb=0;
	$nb=$pdf->NbLines(190, utf8_decode($textoResultado));
	$h=4*$nb + 8;
	//Issue a page break first if needed
	if ($first){
	    $first = false;
	} else {
	    $pdf->CheckPageBreak($h);
	}

	$pdf->SetTextColor(255, 255, 255);
	$pdf->SetFont('Arial', 'B', 12);
	$pdf->Cell(190, 8, utf8_decode($puntoDeVenta['titulo']), 1, 0, "L", true);
	$pdf->Ln();

	$pdf->SetTextColor(0, 0, 0);
	$pdf->SetFont('Arial', '', 10);
	$pdf->MultiCell(190, 4, utf8_decode($textoResultado), 1, "L", false);

	$pdf->Ln(5);

}

$pdf->Output();