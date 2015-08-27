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
		$this->Image('imagenes/logo.jpg',10,8,40);
		//Arial bold 15
		$this->SetFont('Arial','B',15);
		//Movernos a la derecha

		//Título
		$this->SetX(50);
		$this->Cell(110,10,utf8_decode('Sistema de Control de Terminales'),0,0,'C');
		$this->Ln();
		$this->SetX(50);
		$this->Cell(110,10,utf8_decode('Impresión de tarifario'),0,0,'C');

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
		$this->Image("imagenes/logo_puertochico.jpg", $this->GetX(), $this->GetY() + 2, 5);
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

$pdf = new PDF();
$pdf->setTerminal($data['terminal']);
$pdf->AliasNbPages();
$pdf->AddPage();
$pdf->SetFont('Arial', 'B', 15);

$pdf->Cell(20, 8, utf8_decode("Código"), 1, 0, "R");
$pdf->Cell(110, 8, utf8_decode("Tarifa"), 1, 0, "C");
$pdf->Cell(25, 8, "Unidad", 1, 0, "C");
$pdf->Cell(35, 8, "Tope", 1, 0, "C");
$pdf->Ln();

foreach ($data['pricelist'] as $price) {
	$pdf->SetFont('Arial', '', 10);

	//Calculate the height of the row
	$nb=0;
	$nb=$pdf->NbLines(110, $price['description']);
	$h=5*$nb;
	//Issue a page break first if needed
	$pdf->CheckPageBreak($h);

	$pdf->setX(30);

	$x=$pdf->GetX();
	$y=$pdf->GetY();

	$pdf->MultiCell(110, 5, utf8_decode($price['description']), 1, "L");

	$h = $pdf->getY();

	$pdf->setXY(10, $y);
	$pdf->Cell(20, $h - $y, $price['code'], 1, 0, "L");
	$pdf->setX(140);
	if (isset($price['unit'])){
		$pdf->Cell(25, $h - $y, $price['unit'], 1, 0, "L");
	} else {
		$pdf->Cell(25, $h - $y, "SIN DEFINIR", 1, 0, "L");
	}
	if (isset($price['orderPrice'])){
		$pdf->Cell(35, $h - $y, "US$ " . number_format($price['orderPrice'], 2), 1, 0, "R");
	} else {
		$pdf->Cell(35, $h - $y, "SIN DEFINIR", 1, 0, "R");
	}

	$pdf->Ln();

}

$pdf->Output();